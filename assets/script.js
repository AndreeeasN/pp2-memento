let rowAmount = document.getElementById("row");
let columnAmount = document.getElementById("column");
let inputButton = document.getElementById("button");
let grid = document.getElementById("grid");

//Generate tilegrid
function generateTileGrid(){

    //Clears grid before creating new ones
    clearTileGrid();

    //Sets the grid size to fit
    grid.style.gridTemplateColumns = `repeat(${columnAmount.value}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rowAmount.value}, 1fr)`;
    
    //Creates a new .tile div for every column in every row
    for(let i = 0; i < rowAmount.value; i++){
        
        for(let j = 0; j < columnAmount.value; j++){
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

button.addEventListener("click", generateTileGrid);