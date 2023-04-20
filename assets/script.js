let difficultyDownButton = document.getElementById("difficultyDown");
let difficultyUpButton = document.getElementById("difficultyUp");
let grid = document.getElementById("grid");
let difficulty = 3;

//Generate tilegrid
function generateTileGrid(){

    //Clears grid before creating new tiles
    clearTileGrid();

    //Sets the grid size to fit
    grid.style.gridTemplateColumns = `repeat(${difficulty}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${difficulty}, 1fr)`;

    //Creates a new .tile div for every column in every row
    for(let i = 0; i < difficulty; i++){
        
        for(let j = 0; j < difficulty; j++){
            let tile = document.createElement('div');
            tile.className="tile";
            tile.innerText=`${i+1}|${j+1}`
            
            grid.appendChild(tile);
        }
    }
}

function clearTileGrid(){
    grid.innerHTML="";
}

function difficultyDown(){
    if(difficulty>2){
        difficulty--;
    }
    generateTileGrid();
}

function difficultyUp(){
    if(difficulty<25){
        difficulty++;
    }
    generateTileGrid();
}

difficultyDownButton.addEventListener("click", difficultyDown);
difficultyUpButton.addEventListener("click", difficultyUp);

generateTileGrid()