let levelResetButton = document.getElementById("levelReset");
let levelUpButton = document.getElementById("levelUp");
let grid = document.getElementById("grid");
let tilesArray = [];
let correctTiles = [];
let level = 1;
let maxLevel = 64;
//Difficulty is used for grid size (3 is 3x3, 4 is 4x4 etc.)
let difficulty = 3;
let mode = "select";

//GRID GENERATION 

//Generate tilegrid
function generateTileGrid(){

    //Clears grid before creating new tiles
    clearTileGrid();

    //Sets the grid size to fit all tiles
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

//Generate an array of the tiles to be remembered
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

    //DEBUG - COLORS CORRECT TILES
    let tiles = document.getElementsByClassName("tile");
    for(let index of correctTiles){
        tiles[index].style.backgroundColor="white";
    }
}


function tileInteract(){

    //Reveals tile if it exists in correctTiles[] and user is allowed to select
    if(mode === "select"){
        //Index of the selected tile
        let tileIndex = tilesArray.indexOf(this)
        let tiles = document.getElementsByClassName("tile");

        if (correctTiles.includes(tileIndex)){
            
            tiles[tileIndex].style.backgroundColor="lightgreen";
        }
        else{
            tiles[tileIndex].style.backgroundColor="lightcoral";
        }
    }
}

//Clears the grid, used inbetween levels
function clearTileGrid(){
    grid.innerHTML="";
    correctTiles=[];
}

//Resets level
function levelReset(){
    if(level>1){
        level=1;
        calculateDifficulty();
    }

    generateTileGrid();
    generateCorrectTiles();
}

//Increases level
function levelUp(){
    if(level<maxLevel){
        level++;
        calculateDifficulty();
    }

    generateTileGrid();
    generateCorrectTiles();
}

function calculateDifficulty(){
    //Increases difficulty every 3rd level
    if (level % 3 === 1){
        //Add 3 since we start with a 3x3 grid
        difficulty = Math.floor(level/3)+3;
    }
}

levelResetButton.addEventListener("click", levelReset);
levelUpButton.addEventListener("click", levelUp);

generateTileGrid();
generateCorrectTiles();
