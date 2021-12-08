/* old key press detector
window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    switch (event.key) {
        case "ArrowDown":
            moveDown()
            console.log("down");
            break;
        case "ArrowUp":
            rotate_cw();
            console.log("up");
            break;
        case "ArrowLeft":
            move_left();
            console.log("left");
            break;
        case "ArrowRight":
            move_right();
            console.log("right");
            break;
        case " ":
            hardDrop();
            console.log("space");
            break;
        case "z":
            rotate_ccw();
            console.log("Z");
            break;
        case "c":
            console.log("C");
            break;
        case "a":
            rotate_180();
            console.log("A");
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}, true);
// the last option dispatches the event to the listener first,
// then dispatches event to window
*/




// initialize internal game grid array
let gameSpace = [''];
while(gameSpace.length < 220) { gameSpace.push(''); }
console.log(gameSpace);



// initialize game grid on html page
const gridsContainer = document.querySelector('#gridsContainer')
// 2 extra out-of-bound lines for piece to spawn in,
// 20 real lines for gameplay
for(let i=0;i < 220;i++) {
    let newDiv = gridsContainer.appendChild(document.createElement("div"));
    newDiv.classList.add("grid");
}
let grids = Array.from(document.querySelectorAll('#gridsContainer div'))

document.addEventListener('DOMContentLoaded', () => {
    console.log(grids);
})






function render() {
    for(let i=0; i < 220 ;i++) {
        switch(gameSpace[i]) {
            case "z":
                grids[i].className = "grid colorZ";
                break;
            case "s":
                grids[i].className = "grid colorS";
                break;
            case "l":
                grids[i].className = "grid colorL";
                break;
            case "j":
                grids[i].className = "grid colorJ";
                break;
            case "i":
                grids[i].className = "grid colorI";
                break;
            case "t":
                grids[i].className = "grid colorT";
                break;
            case "o":
                grids[i].className = "grid colorO";
                break;
            default:
                if(i < 20) {
                    grids[i].className = "grid gridSpawn";
                }else {
                    grids[i].className = "grid";
                }
                break;
        }
    }
}



// initial the first bag
let pieceBag = ['Z', 'S', 'L', 'J', 'I', 'T', 'O'];
shuffle(pieceBag);
// The 7-bag piece generator
function generateBag() {
    let tempBag = ['Z', 'S', 'L', 'J', 'I', 'T', 'O'];
    shuffle(tempBag);
    pieceBag = tempBag.concat(pieceBag);
}



const startingTime = new Date();
function getTime() {
    return (new Date().getTime()) - startingTime;
}

/* This clears the render of current piece, so it doesn't leave weird blocks behind */
function clearCurrentRender() {
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = ""; }
}

function rotate_cw() {
    let rotationNext = rotation;
    if(rotation < 3) rotationNext++;
    else rotationNext = 0;

    // I'll ignore the fact that rotating can clip the piece through the wall for now
    // I'll fix it later

    // Checks for pre-existing blocks and prevents clipping
    for(let i=0;i < 4;i++) {
        if(gameSpace[currentPiece[rotationNext][i] + verticalPosition + horizontalPosition] !== "") {
            let isClipping = true;
            // if the block in check is the piece itself, then it's not clipping
            for (let j = 0; j < 4; j++) {
                if ((currentPiece[rotationNext][i]) === currentPiece[rotation][j]) {
                    isClipping = false;
                    break;
                }
            }
            if (isClipping) return; // if the piece will be clipping after movement
        }
    }

    // all clear, move the piece
    clearCurrentRender();
    rotation = rotationNext;
}
function rotate_ccw() {
    let rotationNext = rotation;
    if(rotation > 0) rotationNext--;
    else rotationNext = 3;

    // I'll ignore the fact that rotating can clip the piece through the wall for now
    // I'll fix it later

    // Checks for pre-existing blocks and prevents clipping
    for(let i=0;i < 4;i++) {
        if(gameSpace[currentPiece[rotationNext][i] + verticalPosition + horizontalPosition] !== "") {
            let isClipping = true;
            // if the block in check is the piece itself, then it's not clipping
            for (let j = 0; j < 4; j++) {
                if ((currentPiece[rotationNext][i]) === currentPiece[rotation][j]) {
                    isClipping = false;
                    break;
                }
            }
            if (isClipping) return; // if the piece will be clipping after movement
        }
    }

    clearCurrentRender();
    rotation = rotationNext;
}
function rotate_180() {
    let rotationNext = (rotation + 2) % 4;

    // I'll ignore the fact that rotating can clip the piece through the wall for now
    // I'll fix it later

    // Checks for pre-existing blocks and prevents clipping
    for(let i=0;i < 4;i++) {
        if(gameSpace[currentPiece[rotationNext][i] + verticalPosition + horizontalPosition] !== "") {
            let isClipping = true;
            // if the block in check is the piece itself, then it's not clipping
            for (let j = 0; j < 4; j++) {
                if ((currentPiece[rotationNext][i]) === currentPiece[rotation][j]) {
                    isClipping = false;
                    break;
                }
            }
            if (isClipping) return; // if the piece will be clipping after movement
        }
    }

    clearCurrentRender();
    rotation = rotationNext;
}
function move_left() {
    //stop move_left if any block of the piece is at the left border
    for(let i=0;i < 4;i++) {
        let x = (currentPiece[rotation][i] + horizontalPosition).toString();
        if(x[x.length - 1] === '0') { return; }
    }
    // Checks for pre-existing blocks and prevents clipping
    for(let i=0;i < 4;i++) {
        if(gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition-1] !== "") {
            let isClipping = true;
            // if the block in check is the piece itself, then it's not clipping
            for (let j = 0; j < 4; j++) {
                if ((currentPiece[rotation][i] - 1) === currentPiece[rotation][j]) {
                    isClipping = false;
                    break;
                }
            }
            if (isClipping) return; // if the piece will be clipping after movement
        }
    }

    // all clear, move the piece
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = ""; }
    horizontalPosition--;
}
function move_right() {
    //stop move_right if any block of the piece is at the right border
    for(let i=0;i < 4;i++) {
        let x = (currentPiece[rotation][i] + horizontalPosition).toString();
        if(x[x.length - 1] === '9') { return; }
    }
    // Checks for pre-existing blocks and prevents clipping
    for(let i=0;i < 4;i++) {
        if(gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition+1] !== "") {
            let isClipping = true;
            // if the block in check is the piece itself, then it's not clipping
            for(let j=0;j < 4;j++) {
                if( (currentPiece[rotation][i] + 1) === currentPiece[rotation][j] ) {
                    isClipping = false;
                    break;
                }
            }
            if (isClipping) return; // if the piece will be clipping after movement
        }
    }

    // all clear, move the piece
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = ""; }
    horizontalPosition++;
}

function moveDown() {
    // at-the-bottom detection
    for(let i=0;i < 4;i++) {
        if( (currentPiece[rotation][i] + verticalPosition + horizontalPosition) > 209) {
            return false; // if any part of the piece is already at the bottom
        }
    }
    // collision detection
    for(let i=0;i < 4;i++) {
        if(gameSpace[currentPiece[rotation][i] + verticalPosition+10 + horizontalPosition] !== "") {
            let isClipping = true;
            // if the block in check is the piece itself, then it's not clipping
            for(let j=0;j < 4;j++) {
                if( (currentPiece[rotation][i] + 10) === currentPiece[rotation][j] ) {
                    isClipping = false;
                    break;
                }
            }
            if (isClipping) { return false } // if the piece will be clipping after movement
        }
    }

    clearCurrentRender();
    verticalPosition += 10;
    return true;
}
function hardDrop() {
    while(moveDown()) {}

    update();
    spawnPiece();
}


const pieceZ = [[0,1,11,12], [2,11,12,21], [10,11,21,22], [1,10,11,20]];
const pieceS = [[1,2,10,11], [1,11,12,22], [11,12,20,21], [0,10,11,21]];
const pieceL = [[2,10,11,12], [1,11,21,22], [10,11,12,20], [0,1,11,21]];
const pieceJ = [[0,10,11,12], [1,2,11,21], [10,11,12,22], [1,11,20,21]];
const pieceI = [[10,11,12,13], [2,12,22,32], [20,21,22,23], [1,11,21,31]];
const pieceT = [[1,10,11,12], [1,11,12,21], [10,11,12,21], [1,10,11,21]];
const pieceO = [[1,2,11,12], [1,2,11,12], [1,2,11,12], [1,2,11,12]];


let currentPiece;
let currentColor;
function setCurrentPiece(input) {
    currentColor = input.toLowerCase();
    switch(input) {
        case "Z":
            currentPiece = pieceZ;
            break;
        case "S":
            currentPiece = pieceS;
            break;
        case "L":
            currentPiece = pieceL;
            break;
        case "J":
            currentPiece = pieceJ;
            break;
        case "I":
            currentPiece = pieceI;
            break;
        case "T":
            currentPiece = pieceT;
            break;
        case "O":
            currentPiece = pieceO;
            break;
    }
}

function spawnPiece() {
    console.log("spawnPiece called, pieceBag: " + pieceBag);
    if(pieceBag.length < 7) {
        generateBag();
    }

    horizontalPosition = 3;
    verticalPosition = 0;
    rotation = 0;
    setCurrentPiece(pieceBag.pop());


    // collision detection
    for(let i=0;i < 4;i++) {
        if(gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] !== "") {
            // if spawn is blocked
            clearInterval(intervalTick);
            document.getElementById("gameOverPopup").style.display = "block";
        }
    }
}


let rotation = 0;
let horizontalPosition = 3; // x coordinate
let verticalPosition = -10; // always 10's multiple



// This updates the grid class and thus game board color
function update() {
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = ""; }
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = currentColor; }
}


let lastUpdate = Date.now();
let intervalTick = setInterval(tick, 16.6); // about 60 fps

let gravity = 1000; // move down every ? ms
let gravityTimer = 0;

let das = 8; // [frames]
let dasTimer = das;

let arr = 0; // [frames]
let arrTimer = arr;

let hardDropCd = false; // to prevent unintended hard-drop spam
// rotate cool-downs
let cwCd = false;
let ccwCd = false;
let r180Cd = false;

spawnPiece();

function tick() {
    let now = Date.now(); // [ms]
    let dt = now - lastUpdate;
    lastUpdate = now;
    gravityTimer -= dt;


    if(gravityTimer < 0) {
        moveDown();
        gravityTimer += gravity;
    }


    if(keyMap["ArrowDown"]) {
        moveDown();
    }


    // L/R movement
    if(keyMap["ArrowLeft"] && !keyMap["ArrowRight"]) {
        if(dasTimer === das) {
            move_left();
            dasTimer--;
        }else if(dasTimer > 0) {
            dasTimer--;
        }else {
            if (arr === 0) { // if arr is 0 frames then teleport the piece to the border
                for(let i=0;i < 9;i++) {
                    move_left();
                }
            } else { // if arr is not 0, then use the arrTimer
                if (arrTimer <= 0) {
                    move_left();
                    arrTimer = arr;
                } else {
                    arrTimer--;
                }
            }
        }
    }
    if(keyMap["ArrowRight"] && !keyMap["ArrowLeft"]) {
        if(dasTimer === das) {
            move_right();
            dasTimer--;
        }else if(dasTimer > 0) {
            dasTimer--;
        }else {
            if (arr === 0) { // if arr is 0 frames then teleport the piece to the border
                for(let i=0;i < 9;i++) {
                    move_right();
                }
            } else { // if arr is not 0, then use the arrTimer
                if (arrTimer <= 0) {
                    move_right();
                    arrTimer = arr;
                } else {
                    arrTimer--;
                }
            }
        }
    }
    if(!keyMap["ArrowLeft"] && !keyMap["ArrowRight"] && dasTimer !== das) {
        dasTimer = das;
    }

    if(keyMap[" "]) {
        if(!hardDropCd) hardDrop();
        hardDropCd = true; // this stops unintended hard-drop spam every frame
    }else {
        hardDropCd = false;
    }

    if(keyMap["ArrowUp"]) {
        if(!cwCd) rotate_cw();
        cwCd = true;
    }else {
        cwCd = false;
    }
    if(keyMap["z"]) {
        if(!ccwCd) rotate_ccw();
        ccwCd = true;
    }else {
        ccwCd = false;
    }
    if(keyMap["a"]) {
        if(!r180Cd) rotate_180();
        r180Cd = true;
    }else {
        r180Cd = false;
    }

    if(keyMap["c"]) {
        console.log("C");
    }



    update();
    render();
}


// Key press detector
let keyMap = {}; // a array for keys' stats
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    keyMap[e.key] = e.type === "keydown";
}



// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
// See https://github.com/coolaj86/knuth-shuffle
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}