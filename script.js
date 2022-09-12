// -------------- Init canvas --------------
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

const WIDTH = canvas.width = 600;
const HEIGHT = canvas.height = 600;

canvas.style.background = "lightgrey";

const factor = 2; //How many times the is split for a horizontal and vertical orientation (Ex: factor of 2 means that the image is split 2 times (1 vertical and 1 horizontal))
const squareSize = WIDTH/factor; // The segment size of one square according to the factor
// const spaceVal = 0;

function createImg(imgSrc){
    let img = new Image();
    img.src = imgSrc;
    return img;
}

// -------------- Class --------------

class ImageCell{
    static switchPosition(imgCellElt1, imgCellElt2) {
        let tempPos = imgCellElt1.position;
        let tempId = imgCellElt1.id;
        imgCellElt1.position = imgCellElt2.position;
        // imgCellElt1.id = imgCellElt2.id;
        imgCellElt2.position = tempPos;
        // imgCellElt2.id = tempId;
    }

    constructor(imgSrc, cellId, offsetStep, colSize, rowSize, targetPos, targetWidth, targetHeight) {
        this.img = imgSrc;
        this.id = cellId;
        this.offsetStep = offsetStep;
        this.colSize = colSize;
        this.rowSize = rowSize;
        this.position = targetPos;
        this.width = targetWidth;
        this.height = targetHeight;
        this.isHide = false;
    }

    draw(ctx) {
        if(this.isHide){
            ctx.fillStyle = "black";
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        } else {
            ctx.drawImage(
                this.img,
                (this.img.width*this.offsetStep.x)/this.colSize,// offset step x
                (this.img.height*this.offsetStep.y)/this.rowSize,// offset step y
                this.img.width/this.colSize,//img portion width
                this.img.height/this.rowSize,//img portion height
                this.position.x,//target pos X
                this.position.y,//target pos Y
                this.width,//target width
                this.height//target height
            );
        }
    }

    toggleHide() {
        if(this.isHide){this.isHide = false;} 
        else {this.isHide = true;}
    }

    isClicked(clickPos) {
        // console.log(this.offsetPos.x+"/"+this.offsetPos.y);
        if((clickPos.x > this.position.x && clickPos.x < (this.position.x + this.width)) && (clickPos.y > this.position.y && clickPos.y < (this.position.y + this.height))) return true;
        return false;
    }
}

class ImageGrid{
    constructor(imgSrc, numberOfCols, numberOfRows, width, height, startPos = {x: 0, y: 0}){
        this.startGame = false;
        this.position = startPos;
        this.img = createImg(imgSrc);
        this.numberOfCols = numberOfCols;
        this.numberOfRows = numberOfRows;
        this.imgGrid = new Array();
        let targetWidth = width/numberOfCols,
            targetHeight = height/numberOfRows;

        for(let y=0; y < numberOfRows; y++) {
            let currentRow = new Array();
            for(let x = 0; x < numberOfCols; x++){
                let targetPos = {x: (targetWidth)*x, y: (targetHeight)*y};
                currentRow.push(new ImageCell(this.img, (y*numberOfCols+x), {x: x, y: y}, numberOfCols, numberOfRows, targetPos, targetWidth, targetHeight));
                if(y === (numberOfRows - 1) && x === (numberOfCols -1)) currentRow[x].toggleHide();
            }
            this.imgGrid.push(currentRow);
        }
    }

    drawCell(ctx, position){
        this.imgGrid[position.y][position.x].draw(ctx);
    }

    draw(ctx){
        for (let y=0; y<this.numberOfRows; y++){
            for (let x=0; x<this.numberOfCols; x++){
                this.drawCell(ctx, {x: x, y: y});
            }
        }
    }

    handleClick(clickPos){
        for (let y=0; y<this.numberOfRows; y++){
            for (let x=0; x<this.numberOfCols; x++){
                let cell = this.imgGrid[y][x];
                if (cell.isClicked(clickPos)) {
                    this.checkNeighbours(y, x);
                }
            }
        }
    }

    // Paramaters of type ({GridCoord: {x, y}, cell: cellElt},{GridCoord: {x, y}, cell: cellElt})
    switchCells(data1, data2) {
        let cell1 = data1.cell;
        let cell2 = data2.cell;
        let pos1 = data1.gridPos;
        let pos2 = data2.gridPos;

        ImageCell.switchPosition(cell1, cell2);
        // console.log("Cell 1 :",cell1);
        // console.log("Cell 2 :",cell2);
        let temp = cell1;
        this.imgGrid[pos1.y][pos1.x] = this.imgGrid[pos2.y][pos2.x];
        this.imgGrid[pos2.y][pos2.x] = temp;
    }

    checkNeighbours(col, row){
        // for (let y=0; y<this.numberOfRows; y++){
        //     for (let x=0; x<this.numberOfCols; x++){
        //         let cell = this.imgGrid[y][x];
        //         if (cell.isClicked(clickPos)) {
        //             this.checkNeighbours(cell.position);
        //         }
        //     }
        // }
        let cell = this.imgGrid[col][row];
        let hiddenCell = null;
        let hiddenCellGridCoord = {};
        console.log(cell, col, row);

        if(cell.isHide) return;
        
        if((col < this.numberOfCols-1) && this.imgGrid[col+1][row].isHide) {
            console.log("Switch 1");
            hiddenCell = this.imgGrid[col+1][row];
            hiddenCellGridCoord['x'] = row;
            hiddenCellGridCoord['y'] = col+1;
            // return this.switchCells(cell, this.imgGrid[col+1][row]);
        }
        
        if((col >= 1) && this.imgGrid[col-1][row].isHide) {
            console.log("Switch 2");
            hiddenCell = this.imgGrid[col-1][row];
            hiddenCellGridCoord['x'] = row;
            hiddenCellGridCoord['y'] = col-1;
            // return this.switchCells(cell, this.imgGrid[col-1][row]);
        }
        
        if((row < this.numberOfRows-1) && this.imgGrid[col][row+1].isHide) {
            console.log("Switch 3");
            hiddenCell = this.imgGrid[col][row+1];
            hiddenCellGridCoord['x'] = row+1;
            hiddenCellGridCoord['y'] = col;
            // return this.switchCells(cell, this.imgGrid[col][row+1]);
        }
        
        if((row >= 1) && this.imgGrid[col][row-1].isHide) {
            console.log("Switch 4");
            hiddenCell = this.imgGrid[col][row-1];
            hiddenCellGridCoord['x'] = row-1;
            hiddenCellGridCoord['y'] = col;
            // return this.switchCells(cell, this.imgGrid[col][row-1]);
        }

        if(hiddenCell !== null){
            let pos1 = {x:row,y:col};
            this.switchCells({gridPos: pos1, cell: cell}, {gridPos: hiddenCellGridCoord, cell: hiddenCell});
        }
    }

    shuffleGrid(n) {
        if(n === 0) {
            this.startGame = true;
            return;
        }
        let pos1 = {
            x: Math.floor(Math.random()*this.numberOfCols),
            y: Math.floor(Math.random()*this.numberOfRows)
        }
        let pos2 = {
            x: Math.floor(Math.random()*this.numberOfCols),
            y: Math.floor(Math.random()*this.numberOfRows)
        }
        let cell1 = this.imgGrid[pos1.y][pos1.x];
        let cell2 = this.imgGrid[pos2.y][pos2.x];
        // console.log("Cell 1 :",cell1);
        // console.log("Cell 2 :",cell2);
        this.switchCells({gridPos: pos1, cell: cell1}, {gridPos: pos2, cell: cell2});
        // setTimeout(()=>{
        // }, 3000);

        this.shuffleGrid(n-1);
    }

    verifyGrid() {
        let supposedId = 0;
        for (let y=0; y<this.numberOfRows; y++){
            for (let x=0; x<this.numberOfCols; x++){
                let currentCell = this.imgGrid[y][x];
                if(currentCell.id !== supposedId++) return false;
            }
        }

        return true;
    }
}


// -------------- Start display --------------
const imgURL = 'https://images.unsplash.com/photo-1662981095676-cd01749247f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';
const imgURL2 = 'https://i.picsum.photos/id/944/200/200.jpg?hmac=1Hdj8yjDsg6pbmgsiAGRdUQ8MA4hfi4uapepYyrMaGU';


let gridImg = new ImageGrid(imgURL, factor, factor, WIDTH, HEIGHT);

    gridImg.shuffleGrid(10);
// setTimeout(() => {
//     gridImg.shuffleGrid(10);
//     gridImg.shuffleGrid(10);
// }, 3000);
let startGame = false;
function loop(){
    context.clearRect(0, 0, WIDTH, HEIGHT);
    gridImg.draw(context);

    // gridImg.shuffleGrid(1);
    // gridImg.shuffleGrid(10);
    
    if(gridImg.startGame && gridImg.verifyGrid()){
        alert("Bravo puzzle complet");
    }
    window.requestAnimationFrame(loop);   
}
loop();


// Handle click on canvas
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gridImg.handleClick({x: x, y: y});
})
