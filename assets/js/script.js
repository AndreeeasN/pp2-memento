let tilesArray = [];
let selectedTiles = [];
let correctTiles = [];

let level = 1;
let maxLevel = 64;
let difficulty = 3;
let score = 0;
let lives = 3;
let userCanInteract = false;
let userCorrectSelections = 0;
let userWrongSelections = 0;

//TILE GENERATION

/**
 * Generates tilegrid, size is based on difficulty
 */
function generateTileGrid(){
    let grid = document.getElementById("grid");

    //Ensures user can't interact with tiles and resets selections
    userCanInteract = false;
    resetPlayerSelections();

    //Clears grid and correctTiles array before creating new tiles
    grid.innerHTML="";
    correctTiles=[];

    //Sets the grid size to fit all tiles (grid size is difficulty*difficulty)
    difficulty = calculateDifficulty();
    grid.style.gridTemplateColumns = `repeat(${difficulty}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${difficulty}, 1fr)`;

    //Creates a new .tile div for every column in every row and appends to grid
    for(let i = 0; i < difficulty; i++){
        for(let j = 0; j < difficulty; j++){

            let newTile = document.createElement('div');
            newTile.className="tile";
            //Adds tileInteract() on click
            newTile.addEventListener("click", tileInteract);

            grid.appendChild(newTile);
        }
    }
    //Sets array of tiles for use in tileInteract(), as normal HTMLCollections lack the indexOf() function
    tilesArray = Array.from(document.getElementsByClassName("tile"));
}

/**
 *Generate an array of correct tile numbers for user to remembere
 */
function generateCorrectTiles(){
    //The amount of correct tiles needed, we'll start with 2 tiles on level 1
    let neededTiles = level + 1;

    //Generates random numbers inbetween 1 and difficulty^2 and adds to array of correct tiles
    while(correctTiles.length < neededTiles){

        let num = Math.floor(Math.random() * (difficulty * difficulty));
        if(correctTiles.indexOf(num) === -1){
            correctTiles.push(num);
        }        
    }
}

//TILE DISPLAY

/**
 *  Reveals all correct tiles by setting their background color to white
 */
function revealCorrectTiles(){
    let tiles = document.getElementsByClassName("tile");
    for(let index of correctTiles){
        tiles[index].style.backgroundColor="white";
    }
}

/**
 * Resets all tile colors and allows user interaction
 */
function hideCorrectTiles(){
    let tiles = document.getElementsByClassName("tile");
    for(let tile of tiles){
        tile.style.backgroundColor="";
        tile.style.border = "";
    }
    userCanInteract = true;
}

/**
 * Sets green border on correct tiles, used before moving to next level 
 */
function confirmCorrectTiles(){
    let tiles = document.getElementsByClassName("tile");
    for(let index of correctTiles){
        tiles[index].style.border="4px solid green";
    }
}

/**
 * Used for all tile interactions.
 * Checks if selection is valid and calls correctTileSelection() if correct, wrongTileSelection() if incorrect
 */
function tileInteract(){
    //Reveals tile if it exists in correctTiles[] and user is allowed to select
    if(userCanInteract){
        //Index of the selected tile
        let tileIndex = tilesArray.indexOf(this);
        let tiles = document.getElementsByClassName("tile");

        //If tile has already been selected return, else add to array of selected tiles
        if (selectedTiles.includes(tileIndex)){ 
            return; 
        }
        else
        {
            //Add tile to selected tiles array
            selectedTiles.push(tileIndex);
        }

        //If selected tile is correct (tile index exists in correctTiles[])
        if (correctTiles.includes(tileIndex)){
            correctTileSelection(tiles, tileIndex);
        }
        //If selected tile is incorrect
        else
        {
            wrongTileSelection(tiles, tileIndex);
        }
    }
}

/**
 * Called on correct tile selection, used primarily in tileInteract();
 * @param {HTMLCollectionOf<Element>} tiles Array of all tile HTML elements
 * @param {number} tileIndex The index of selected tile
 */
function correctTileSelection(tiles, tileIndex){
    //Sets tile to green and increases score
    tiles[tileIndex].style.backgroundColor="lightgreen";
    userCorrectSelections++;
    increaseScore();

    //If all correct tiles selected => Disable input, mark correct tiles, wait, move to next level
    if(userCorrectSelections >= correctTiles.length){
        userCanInteract = false;
        resetPlayerSelections();

        confirmCorrectTiles();

        setTimeout(() => {
            levelUp();
            newLevel();
        }, 1000);
    }
}

/**
 * Called on incorrect tile selection, used primarily in tileInteract();
 * @param {HTMLCollectionOf<Element>} tiles Array of all tile HTML elements
 * @param {number} tileIndex The index of selected tile
 */
function wrongTileSelection(tiles, tileIndex){
    //Set color to red and increase "wrong" counter
    tiles[tileIndex].style.backgroundColor="lightcoral";
    userWrongSelections++;
    
    //If 3 incorrect tiles selected => Disable input, show correct tiles, wait, retry level
    if(userWrongSelections >= 3){
        userCanInteract = false;
        resetPlayerSelections();
        confirmCorrectTiles();
        decreaseLives();

        //If player still has lives left retry level, else game over
        if(lives){
            setTimeout(() => {
                newLevel();
            }, 2000);
        }
        else
        {
            setTimeout(() => {
                gameOver();
            }, 2000);
        }
    }
}

//LEVEL MANAGEMENT

/**
 * All requirements for starting new level.
 * Generates tilegrid and correct tiles -> reveals correct tiles -> hides correct tiles
 */
function newLevel(){
    //Generates grid
    generateTileGrid();
    generateCorrectTiles();

    //Waits before revealing all correct tiles,
    setTimeout(() => {
        revealCorrectTiles();
    }, 1000);

    //Waits before hiding tiles, slightly increases every level
    setTimeout(() => {
        hideCorrectTiles();
    }, 2000+(level*100));
}

/**
 * Increases level and calls updateLevelCounter()
 */
function levelUp(){
    if(level<maxLevel){
        level++;
    }
    updateLevelCounter();
}

/**
 * Resets level to 1 and calls updateLevelCounter(), used on restart
 */
function resetLevel(){
    if(level>1){
        level=1;
    }
    updateLevelCounter();
}

/**
 * Updates the level counter
 */
function updateLevelCounter(){
    let levelDiv = document.getElementById("level");
    levelDiv.innerHTML = `<h1>Level ${level}</h1>`;
}

/**
 * Resets selected tiles and correct/incorrect selections
 */
function resetPlayerSelections(){
    selectedTiles = [];
    userCorrectSelections = 0;
    userWrongSelections = 0;
}

/**
 * Calculates difficulty based on current level
 * @returns Difficulty, used for grid size (3 is 3x3, 4 is 4x4 etc.)
 */
function calculateDifficulty(){
    //Easiest difficulty lasts for 2 levels
    if (level <= 2){
        difficulty = 3;
    }//Second difficulty lasts for 3 levels
    else if(level <= 5){
        difficulty = 4;
    }else{
        //All subsequent difficulties increase every 4 levels (+3 since we start with a 3x3 grid)
        difficulty = Math.ceil((level - 1)/ 4) + 3;
    }
    return difficulty;
}

/**
 * Decreases life by 1, used on 3 wrong tile selections
 */
function decreaseLives(){
    lives--;
    updateLivesCounter();
}

/**
 * Sets lives to 3, used on reset
 */
function resetLives(){
    lives = 3;
    updateLivesCounter();
}

/**
 * Generates the 3 hearts in #lives div based on player lives
 */
function updateLivesCounter(){
    let livesDiv = document.getElementById("lives");
    livesDiv.innerHTML = "";

    let tempLives = lives;
    for(let i = 0; i < 3; i++){
        //If player has lives generate a heart, otherwise a gray broken heart
        if(tempLives){
            livesDiv.innerHTML+=`<i class="fa-solid fa-heart "></i>`;
            tempLives--;
        }
        else
        {
            livesDiv.innerHTML+=`<i class="fa-solid fa-heart-crack" style="color: #666"></i>`;
        }
    }
}

/**
 * Increases score by 1 and updates score counter
*/
function increaseScore(){
    score++;
    updateScoreCounter();
}

/**
 * Resets score to 0 and updates score counter
 */
function resetScore(){
    score = 0;
    updateScoreCounter();
}

/**
 * Updates score counter to match current score
 */
function updateScoreCounter(){
    let scoreDiv = document.getElementById("score");
    scoreDiv.innerHTML = `Score: ${score}`;
}

//GAME START / END

/**
 * Used for starting a new game.
 * Resets all counters and starts a new level
 */
function gameStart(){
    generateGameElements();

    resetLives();
    resetScore();
    resetLevel();
    newLevel();
}

/**
 * Used for ending current game.
 * Opens window displaying score and retry button.
 */
function gameOver(){
    generateRetryWindow();
}

/**
 * Is called on page load, creates empty playing field with play button
 */
function startUp(){
    generateHowToPlay();
}

/**
 * Replaces contents of game-container with instructions on how to play and a play button
 */
function generateHowToPlay(){
    let gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML =`
    <div id="how-to-play">
        <h1>How to play</h1>
        <ol>
            <li>A pattern of tiles will flash white. Memorize these tiles!</li>
            <li>Once hidden, click as many tiles as you can remember.</li>
            <li>Picking the wrong tile 3 times will cost you a life.</li>
            <li>Levels get progressively more difficult, make it as far as you can!</li>
            <li id="small-text">To quickly restart, refresh page by clicking the "Memento" logo</li>
        </ol>
        <h2>Start</h2>
        <div class="play-button">
            <i class="fa-solid fa-play"></i>
        </div>
    </div>
    `;
    //Calls gameStart() on play button click
    let playButton = document.getElementsByClassName("play-button");
    playButton[0].addEventListener("click", gameStart);
}

/**
 * Replaces contents of game-container with the required elements to play the game
 */
function generateGameElements(){
    let gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML =`
    <div id="level"></div>
    <div id="score"></div>
    <div id="lives"></div>
    <div id="grid-container">
        <div id="grid"></div>
    </div>
    `;
}

/**
 * Replaces contents of game-container with achieved score and button to retry
 */
function generateRetryWindow(){
    let gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML =`
    <div id="how-to-play">
        <h1>Score: ${score}</h1>
        
        <div id="retry-buttons">
            <div>
                <h2>Go back</h2>
                <div class="play-button" id="return-button">
                    <i class="fa-solid fa-house"></i>
                </div>
            </div>
            <div>
                <h2>Retry?</h2>
                <div class="play-button" id="retry-button">
                    <i class="fa-solid fa-rotate-right"></i>
                </div>
            </div>
        </div>
    </div>
    `;
    //Calls generateHowToPlay() on return button click
    let returnButton = document.getElementById("return-button");
    returnButton.addEventListener("click", generateHowToPlay);

    //Calls gameStart() on retry button click
    let retryButton = document.getElementById("retry-button");
    retryButton.addEventListener("click", gameStart);
}

//Runs startUp() on page load
window.onload = startUp;