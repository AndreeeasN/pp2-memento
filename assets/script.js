let levelResetButton = document.getElementById("levelReset");
let levelUpButton = document.getElementById("levelUp");
let grid = document.getElementById("grid");
let tilesArray = [];
let selectedTiles = [];
let correctTiles = [];
let level = 1;
let maxLevel = 64;
let difficulty = 3;
let score = 0;
let userCanInteract = false;
let userCorrectSelections = 0;
let userWrongSelections = 0;

//Generate tilegrid
function generateTileGrid(){
    //Ensures user can't interact with tiles and resets selections
    userCanInteract = false;
    resetPlayerSelections();

    //Clears grid before creating new tiles
    clearTileGrid();

    //Sets the grid size to fit all tiles (difficulty decides grid size, difficulty*difficulty)
    grid.style.gridTemplateColumns = `repeat(${difficulty}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${difficulty}, 1fr)`;

    //Creates a new .tile div for every column in every row
    for(let i = 0; i < difficulty; i++){
        for(let j = 0; j < difficulty; j++){

            let newTile = document.createElement('div');
            newTile.className="tile";
            newTile.innerText=`${i + 1}|${j + 1}`
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
    for(let i of tiles){
        i.style.backgroundColor="#666";
    }
    userCanInteract = true;
}

//All requirements for starting new level
function newLevel(){
    //Generates grid
    generateTileGrid();
    generateCorrectTiles();

    //Waits before revealing all correct tiles
    setTimeout(() => {
        revealCorrectTiles();
    }, 500);

    //Waits before hiding tiles
    setTimeout(() => {
        hideCorrectTiles();
    }, 2000);
}

function tileInteract(){
    //Reveals tile if it exists in correctTiles[] and user is allowed to select
    if(userCanInteract){
        //Index of the selected tile
        let tileIndex = tilesArray.indexOf(this)
        let tiles = document.getElementsByClassName("tile");

        //If tile has already been selected do nothing, else add to array of selected tiles
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
            score++;
            userCorrectSelections++;
        }
        //If selected tile is incorrect
        else
        {
            tiles[tileIndex].style.backgroundColor="lightcoral";
            userWrongSelections++;
        }
    }

    //Disables input and waits before moving to the next level
    if(userCorrectSelections >= correctTiles.length){
        userCanInteract = false;
        resetPlayerSelections();

        setTimeout(() => {
            levelUp();
            newLevel();
        }, 1000);
    }
}

//Clears the grid, used inbetween levels
function clearTileGrid(){
    grid.innerHTML="";
    correctTiles=[];
}

//Increases level
function levelUp(){
    if(level<maxLevel){
        level++;
        calculateDifficulty();
    }
}

//Resets level, used on restart
function levelReset(){
    if(level>1){
        level=1;
        calculateDifficulty();
    }
    resetPlayerSelections();
    newLevel();
}


//Resets amount of selected tiles
function resetPlayerSelections(){
    selectedTiles = [];
    userCorrectSelections = 0;
    userWrongSelections = 0;
}

//Difficulty is used for grid size (3 is 3x3, 4 is 4x4 etc.)
function calculateDifficulty(){
    //Increases difficulty every 3rd level
    if (level % 3 === 1){
        //Add 3 since we start with a 3x3 grid
        difficulty = Math.floor(level/3)+3;
    }
}

levelResetButton.addEventListener("click", levelReset);
levelUpButton.addEventListener("click", levelUp);

newLevel();
