// -------------- Init canvas --------------
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

const WIDTH = canvas.width = 600;
const HEIGHT = canvas.height = 600;

canvas.style.background = "lightgrey";

const factor = 5; //How many times the is split for a horizontal and vertical orientation (Ex: factor of 2 means that the image is split 2 times (1 vertical and 1 horizontal))
const squareSize = WIDTH/factor; // The segment size of one square according to the factor
// const spaceVal = 0;

function createImg(imgSrc){
    let img = new Image();
    img.src = imgSrc;
    return img;
}

// -------------- Class --------------

class ImageCell{
    constructor(imgSrc, offsetStep, colSize, rowSize, targetPos, targetWidth, targetHeight) {
        this.img = imgSrc;
        this.offsetStep = offsetStep;
        this.colSize = colSize;
        this.rowSize = rowSize;
        this.position = targetPos;
        this.width = targetWidth;
        this.height = targetHeight;
        // this.isHide = false;
    }

    draw(ctx) {
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
        )
    }

    // hide(ctx) {
    //     if(this.isHide){
    //         this.draw(ctx);
    //         this.isHide = false;
    //     } else {
    //         ctx.fillStyle = "black";
    //         ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    //         this.isHide = true;
    //     }
    // }

    isClicked(clickPos) {
        // console.log(this.offsetPos.x+"/"+this.offsetPos.y);
        if((clickPos.x > this.position.x && clickPos.x < (this.position.x + this.width)) && (clickPos.y > this.position.y && clickPos.y < (this.position.y + this.height))) return true;
        return false;
    }
}

class ImageGrid{
    constructor(imgSrc, numberOfCols, numberOfRows, width, height, startPos = {x: 0, y: 0}){
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
                currentRow.push(new ImageCell(this.img, {x: x, y: y}, numberOfCols, numberOfRows, targetPos, targetWidth, targetHeight));
            }
            this.imgGrid.push(currentRow);
        }
    }

    drawCell(ctx, position){
        this.imgGrid[position.y][position.x].draw(ctx);
    }

    draw(ctx){
        for (let y=0; y<this.numberOfRows; y++){
            for (let x=0; x<this.numberOfRows; x++){
                this.drawCell(ctx, {x: x, y: y});
            }
        }
    }

    handleClick(ctx, clickPos){
        for (let y=0; y<this.numberOfRows; y++){
            for (let x=0; x<this.numberOfRows; x++){
                if (this.imgGrid[y][x].isClicked(clickPos)) {
                    // this.imgGrid[y][x].hide(ctx);
                }
            }
        }
    }
}


// -------------- Start display --------------
const imgURL = 'https://images.unsplash.com/photo-1662981095676-cd01749247f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';
const imgURL2 = 'https://i.picsum.photos/id/944/200/200.jpg?hmac=1Hdj8yjDsg6pbmgsiAGRdUQ8MA4hfi4uapepYyrMaGU';




// Create 4 image segment;
// let imgArr = new Array();

// for (let i=0; i<4; i++){
//     let position;
//     let offsetStep;
//     switch(i){
//         case 0: 
//             position={x:0,y:0};
//             offsetStep={x:0,y:0};
//             break;

//         case 1: 
//             position={x:squareSize,y:0};
//             offsetStep={x:1,y:0};
//             break;

//         case 2: 
//             position={x:0,y:squareSize};
//             offsetStep={x:0,y:1};
//             break;

//         case 3: 
//             position={x:squareSize,y:squareSize};
//             offsetStep={x:1,y:1};
//             break;

//         default:
//             break;
//     }
//     let img = new ImageCell(imgURL2, offsetStep, 2, 2, position, squareSize, squareSize);
//     imgArr.push(img);
// }

// for(let i = 0; i< imgArr.length; i++){
//     let img = imgArr[i];
//     img.draw(context);
// }
let gridImg = new ImageGrid(imgURL, factor, factor, WIDTH, HEIGHT);
gridImg.draw(context);


// Handle click on canvas
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gridImg.handleClick(context, {x: x, y: y});
    // for(let i = 0; i< imgArr.length; i++){
    //     let img = imgArr[i];
    //     imgClicked = img.isClicked({x: x, y: y});
    //     if (imgClicked) console.log(`L'image n°${i+1} isClick`);
    // }
})
