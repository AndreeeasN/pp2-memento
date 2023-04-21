let difficultyDownButton = document.getElementById("difficultyDown");
let difficultyUpButton = document.getElementById("difficultyUp");
let grid = document.getElementById("grid");
let level = 3;
let difficulty = 3;
let correctTiles = [];


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
            newTile.innerText=`${i+1}|${j+1}`
            
            grid.appendChild(newTile);
        }
    }
}

//Generate an array of the tiles to be remembered
function generateCorrectTiles(){
    //The amount of correct tiles needed, we'll start with 3 tiles on level 1
    let neededTiles = level + 2;

    //Generates random numbers inbetween 1 and difficulty^2 and adds to array of correct tiles
    while(correctTiles.length < neededTiles){

        let num = Math.floor(Math.random() * difficulty*difficulty) ;
        if(correctTiles.indexOf(num) === -1){
            correctTiles.push(num);
        }        
    }

    //DEBUG - COLORS TILES
    let tiles = document.getElementsByClassName("tile");
    for(let index of correctTiles){
        tiles[index].style.backgroundColor="green";
    }
    console.log(tiles);
}

function clearTileGrid(){
    grid.innerHTML="";
    correctTiles=[];
}

function difficultyDown(){
    if(difficulty>2){
        difficulty--;
        level-=3;
    }
    
    generateTileGrid();
    generateCorrectTiles();
}

function difficultyUp(){
    if(difficulty<25){
        difficulty++;
        level+=3;
    }
    
    generateTileGrid();
    generateCorrectTiles();
}

difficultyDownButton.addEventListener("click", difficultyDown);
difficultyUpButton.addEventListener("click", difficultyUp);


