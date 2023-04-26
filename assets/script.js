let grid = document.getElementById("grid");

let tilesArray = [];
let selectedTiles = [];
let correctTiles = [];

let level = 1;
let maxLevel = 64;
let score = 0;
let lives = 3;
let userCanInteract = false;
let userCorrectSelections = 0;
let userWrongSelections = 0;

//TILE GENERATION

//Generate tilegrid
function generateTileGrid(){
    //Ensures user can't interact with tiles and resets selections
    userCanInteract = false;
    resetPlayerSelections();

    //Clears grid before creating new tiles
    clearTileGrid();

    //Sets the grid size to fit all tiles (difficulty decides grid size, difficulty*difficulty)
    let difficulty = calculateDifficulty();
    grid.style.gridTemplateColumns = `repeat(${difficulty}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${difficulty}, 1fr)`;

    //Creates a new .tile div for every column in every row and appends to grid
    for(let i = 0; i < difficulty; i++){
        for(let j = 0; j < difficulty; j++){

            let newTile = document.createElement('div');
            newTile.className="tile";
            newTile.addEventListener("click", tileInteract);

            grid.appendChild(newTile);
        }
    }

    //Sets array of tiles for use in tileInteract(), as normal HTMLCollections lack the indexOf() function
    tilesArray = Array.from(document.getElementsByClassName("tile"));
}

//Generate an array of correct tile numbers to be remembered
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

//Shows all correct tiles
function revealCorrectTiles(){
    let tiles = document.getElementsByClassName("tile");
    for(let index of correctTiles){
        tiles[index].style.backgroundColor="white";
    }
}

//Resets all tile colors and allows user interaction
function hideCorrectTiles(){
    let tiles = document.getElementsByClassName("tile");
    for(let tile of tiles){
        tile.style.backgroundColor="#666";
        tile.style.border = "2px solid #222"
    }
    userCanInteract = true;
}

//Sets green border on correct tiles, used before moving to next level 
function confirmCorrectTiles(){
    let tiles = document.getElementsByClassName("tile");
    for(let index of correctTiles){
        tiles[index].style.border="4px solid green";
    }
}

//All tile interactions
function tileInteract(){
    //Reveals tile if it exists in correctTiles[] and user is allowed to select
    if(userCanInteract){
        //Index of the selected tile
        let tileIndex = tilesArray.indexOf(this)
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

        //If selected tile is correct
        if (correctTiles.includes(tileIndex)){
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
        //If selected tile is incorrect
        else
        {
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
                    }, 1000);
                }else{
                    setTimeout(() => {
                        gameOver();
                    }, 1000);
                }

                
            }
        }
    }
}

//Clears the grid, used inbetween levels
function clearTileGrid(){
    grid.innerHTML="";
    correctTiles=[];
}

//LEVEL MANAGEMENT

//All requirements for starting new level
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

//Increases level
function levelUp(){
    if(level<maxLevel){
        level++;
    }
    updateLevelCounter();
}

//Resets level, used on restart
function resetLevel(){
    if(level>1){
        level=1;
    }
    updateLevelCounter();
    newLevel();
}

//Updates the level counter
function updateLevelCounter(){
    levelDiv = document.getElementById("level");
    levelDiv.innerHTML = `<h1>Level ${level}</h1>`
}

//Resets selected tiles
function resetPlayerSelections(){
    selectedTiles = [];
    userCorrectSelections = 0;
    userWrongSelections = 0;
}

//Difficulty is used for grid size (3 is 3x3, 4 is 4x4 etc.)
function calculateDifficulty(){
    //Easiest difficulty lasts for 2 levels
    if (level <= 2){
        difficulty = 3;
    }//Second difficulty lasts for 3 levels
    else if(level <= 5){
        difficulty = 4
    }else{
        //All subsequent difficulties increase every 4 levels (+3 since we start with a 3x3 grid)
        difficulty = Math.ceil((level - 1)/ 4) + 3;
    }
    return difficulty;
}

//Decreases life by 1, used on 3 wrong tile selections
function decreaseLives(){
    lives--;
    updateLivesCounter();
}

//Sets lives to 3, used on reset
function resetLives(){
    lives = 3;
    updateLivesCounter();
}

//Generates the 3 hearts above grid depending on player lives
function updateLivesCounter(){
    livesDiv = document.getElementById("lives");
    livesDiv.innerHTML = "";

    let tempLives = lives;
    for(let i = 0; i < 3; i++){
        //If player has lives generate a heart, otherwise a gray broken heart
        if(tempLives){
            livesDiv.innerHTML+=`<i class="fa-solid fa-heart "></i>`
            tempLives--;
        }else{
            livesDiv.innerHTML+=`<i class="fa-solid fa-heart-crack" style="color: #666"></i>`
        }
    }
}

//Increases score by 1 and updates score counter
function increaseScore(){
    score++;
    updateScoreCounter();
}

//Sets score to specific value and updates score counter
function resetScore(){
    score = 0;
    updateScoreCounter();
}

//Updates score counter to match current score
function updateScoreCounter(){
    scoreDiv = document.getElementById("score");
    scoreDiv.innerHTML = `Score: ${score}`
}

//GAME START / END
function gameStart(){
    resetLives();
    resetScore();
    resetLevel();
}

function gameOver(){
    debugResetLevel();
}

//DEBUG FUNCTIONS
let resetLevelButton = document.getElementById("resetLevel");
let levelUpButton = document.getElementById("levelUp");

resetLevelButton.addEventListener("click", debugResetLevel);
levelUpButton.addEventListener("click", debugLevelUp);

function debugLevelUp(){
    clearTimeout();
    levelUp();
    newLevel();
}

function debugResetLevel(){
    clearTimeout();
    resetLives();
    resetScore();
    resetLevel();
}