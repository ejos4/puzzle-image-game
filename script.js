// -------------- Init canvas --------------
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

const WIDTH = canvas.width = 600;
const HEIGHT = canvas.height = 600;

canvas.style.background = "lightgrey";

const factor = 2;
const squareSize = WIDTH/factor;
const spaceVal = 0;


// -------------- Class --------------
class ImageSection{
    constructor(imgSrc, offsetStep, sizeFactor, targetPos, targetWidth, targetHeight) {
        this.img = new Image();
        this.img.src = imgSrc;
        this.offsetStep = offsetStep;
        this.factor = sizeFactor;
        this.targetPos = targetPos;
        this.width = targetWidth;
        this.height = targetHeight;
    }

    draw(ctx) {
        ctx.drawImage(
            this.img,
            (this.img.width*this.offsetStep.x)/this.factor,// offset step x
            (this.img.height*this.offsetStep.y)/this.factor,// offset step y
            this.img.width/this.factor,//img portion width
            this.img.height/this.factor,//img portion height
            this.targetPos.x,//target pos X
            this.targetPos.y,//target pos Y
            this.width,//target width
            this.height//target height
        )
    }

// ndraw(context){
//     // Image 1
//     context.drawImage(
//         imgCls.img,
//         0,// offset step x
//         0,// offset step y
//         imgCls.img.width/factor,//img portion width
//         imgCls.img.height/factor,//img portion height
//         0, //target pos X
//         0,//target pos Y
//         WIDTH/factor,//target width
//         HEIGHT/factor,//target height
//     );
//     // Image 2
//     context.drawImage(
//         imgCls.img,
//         imgCls.img.width/factor,// offset step x
//         0,// offset step y
//         imgCls.img.width/factor,//img portion width
//         imgCls.img.height/factor,//img portion height
//         WIDTH/factor,//target pos X
//         0, //target pos Y
//         WIDTH/factor,//target width
//         HEIGHT/factor,//target height
//     );
// }
}

class ImageSegment{
    constructor(imgSrc, position, width, height, offsetPos={x:0, y:0}, maxPos={x:factor,y:factor}){
        this.img = new Image();
        this.img.src = imgSrc;
        this.position = {x: position.x, y: position.y};
        this.width = width;
        this.height = height;
        this.offsetPos = offsetPos;
    }

    draw(ctx){
        // console.log()
        ctx.drawImage(
            this.img, 
            // 0,0,
            this.offsetPos.x,
            this.offsetPos.y,
            this.offsetPos.x+(this.img.width/factor),
            this.offsetPos.y+(this.img.height/factor)*2,
            // this.img.width,
            // this.img.height,
            this.position.x, 
            this.position.y,
            this.width,
            this.height,
        );
    }

    isClicked(clickPos) {
        // console.log(this.offsetPos.x+"/"+this.offsetPos.y);
        if((clickPos.x > this.position.x && clickPos.x < (this.position.x + this.width)) && (clickPos.y > this.position.y && clickPos.y < (this.position.y + this.height))) return true;
        return false;
    }
}

// -------------- Start display --------------
const imgURL = 'https://images.unsplash.com/photo-1662981095676-cd01749247f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';
const imgURL2 = 'https://i.picsum.photos/id/944/200/200.jpg?hmac=1Hdj8yjDsg6pbmgsiAGRdUQ8MA4hfi4uapepYyrMaGU';




// Create 4 image segment;
let imgArr = new Array();

for (let i=0; i<3; i++){
    let position;
    let offsetStep;
    switch(i){
        case 0: 
            position={x:0,y:0};
            offsetStep={x:0,y:0};
            break;

        case 1: 
            position={x:squareSize,y:0};
            offsetStep={x:1,y:0};
            break;

        case 2: 
            position={x:0,y:squareSize};
            offsetStep={x:0,y:1};
            break;

        case 3: 
            position={x:squareSize,y:squareSize};
            offsetStep={x:1,y:1};
            break;

        default:
            break;
    }
    let img = new ImageSection(imgURL, offsetStep, factor, position, squareSize, squareSize);
    imgArr.push(img);
}

for(let i = 0; i< imgArr.length; i++){
    let img = imgArr[i];
    img.draw(context);
}
// let imgCls = imgArr[0];





// Image 3
// context.drawImage(
//     imgCls.img,
//     0,
//     0,
//     imgCls.img.width,
//     imgCls.img.height,
//     0, 
//     0,
//     WIDTH,
//     HEIGHT,
// );

// Image 4
// context.drawImage(
//     imgCls.img,
//     0,
//     0,
//     imgCls.img.width,
//     imgCls.img.height,
//     0, 
//     0,
//     WIDTH,
//     HEIGHT,
// );

// Handle click on canvas
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for(let i = 0; i< imgArr.length; i++){
        let img = imgArr[i];
        imgClicked = img.isClicked({x: x, y: y});
        if (imgClicked) console.log(`L'image n°${i+1} isClick`);
    }
})
