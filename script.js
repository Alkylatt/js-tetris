// initialize internal game grid array
let gameSpace = [''];
while(gameSpace.length < 220) { gameSpace.push(''); }
console.log(gameSpace);



// get elements on html page
let counter_lineCleared = 0;
const ui_lineCleared = document.querySelector('#ui_lineCleared');
ui_lineCleared.innerHTML = "0";

// initialize game grid on html page
const gridsContainer = document.querySelector('#gridsContainer');
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



function lineClear() {
    let linesToClear = [];
    // check for lines cleared from bottom to top
    for(let i=21;i >= 0;i--) {
        let clear = true;
        for(let j=i*10;j < i*10+10;j++) {
            if(gameSpace[j] === "") {
                clear = false;
                break;
            }
        }
        if(clear) {
            linesToClear[linesToClear.length] = i;
        }
    }

    console.log(linesToClear);
    // go through every element in linesToClear
    for(let i=0;i < linesToClear.length;i++) {
        console.log(i);
        // clear the line
        for(let j=linesToClear[i]*10 + 10*i;j < linesToClear[i]*10 + 10*i + 10;j++) {
            gameSpace[j] = "";
        }
        // move everything above down 1 tile

        for(let j = linesToClear[i]*10 + 10*i - 1;j >= 0;j--) {
            gameSpace[j+10] = gameSpace[j];
            gameSpace[j] = "";
        }
    }

    // update line clear counter
    counter_lineCleared += linesToClear.length;
    ui_lineCleared.innerHTML = counter_lineCleared.toString();
}



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

function checkRotateCollision(rotationNext) {
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
            if (isClipping) return true; // if the piece will be clipping after movement
        }
    }

    // check if the piece is at 0 and 9 simultaneously, then it's clipping
    let checkPos = [];
    for (let i = 0; i < 4; i++) {
        checkPos[i] = (currentPiece[rotationNext][i] + verticalPosition + horizontalPosition) % 10;
    }
    for (let i = 0; i < 4; i++) {
        if(checkPos[i] === 0) {
            for (let j = 0; j < 4; j++) {
                if(checkPos[j] === 9) {
                    return true; // is clipping
                }
            }
            break;
        }
    }
    // return false if no collision happens
    return false;
}

function checkMoveCollision(nextPos) {
    // check for corner clipping
    for (let i = 0; i < 4; i++) {
        if(nextPos[i] < 0 || nextPos[i] > 219) {
            return true; // is clipping at the left-top or right-bottom corner
        }
    }

    // Checks for pre-existing blocks and prevents clipping
    for(let i=0;i < 4;i++) {
        if(gameSpace[nextPos[i]] !== "") {
            let isClipping = true;
            // if the block in check is the piece itself, then it's not clipping
            for (let j = 0; j < 4; j++) {
                if (nextPos[i] === currentPiece[rotation][j] + horizontalPosition + verticalPosition) {
                    isClipping = false;
                    break;
                }
            }
            if (isClipping) return true; // if the piece will be clipping after movement
        }
    }

    // check if the piece is at 0 and 9 simultaneously, then it's clipping
    let checkPos = [];
    for (let i = 0; i < 8; i++) {
        if (i < 4) checkPos[i] = nextPos[i] % 10;
        else checkPos[i] = (currentPiece[rotation][i-4] + horizontalPosition + verticalPosition) % 10;
    }
    for (let i = 0; i < 8; i++) {
        if(checkPos[i] === 0) {
            for (let j = 0; j < 8; j++) {
                if(checkPos[j] === 9) {
                    return true; // is clipping
                }
            }
            break;
        }
    }

    // return false if no collision happens
    return false;
}

const srsTable = [
    // J, L, T, S, Z, (and O maybe)
    [-1, -11, 20, 19], // 0-1
    [1, 11, -20, -19], // 1-0
    [1, 11, -20, -19], // 1-2
    [-1, -11, 20, 19], // 2-1
    [1, -9, 20, 21], // 2-3
    [-1, 9, -20, -21], // 3-2
    [-1, 9, -20, -21], // 3-0
    [1, -9, 20, 21], // 0-3
    // just for I :)
    [-2, 1, 8, -19], // 0-1
    [2, -1, -8, 19], // 1-0
    [-1, 2, -21, 12], // 1-2
    [1, -2, 21, -12], // 2-1
    [2, -1, -8, 19], // 2-3
    [-2, 1, 8, -19], // 3-2
    [1, -2, 21, -12], // 3-0
    [-1, 2, -21, 12] // 0-3
];
// This is where the SRS kicks happens
function srsKick(nextRotation) {
    let tryTable = [0, 0, 0, 0];
    if(rotation === 0) {
        if(nextRotation === 1) {
            // 0 -> R
            if(currentPiece === 'I') tryTable = srsTable[8];
            else tryTable = srsTable[0];
        }else if(nextRotation === 3) {
            // 0 -> L
            if(currentPiece === 'I') tryTable = srsTable[15];
            else tryTable = srsTable[7];
        }else {
            // 0 -> 2
        }
    }else if(rotation === 1) {
        if(nextRotation === 2) {
            // R -> 2
            if(currentPiece === 'I') tryTable = srsTable[10];
            else tryTable = srsTable[2];
        }else if(nextRotation === 0) {
            // R -> 0
            if(currentPiece === 'I') tryTable = srsTable[9];
            else tryTable = srsTable[1];
        }else {
            // R -> L
        }
    }
    else if(rotation === 2) {
        if(nextRotation === 3) {
            // 2 -> L
            if(currentPiece === 'I') tryTable = srsTable[12];
            else tryTable = srsTable[4];
        }else if(nextRotation === 1) {
            // 2 -> R
            if(currentPiece === 'I') tryTable = srsTable[11];
            else tryTable = srsTable[3];
        }else {
            // 2 -> 0
        }
    }
    else if(rotation === 3) {
        if(nextRotation === 2) {
            // L -> 2
            if(currentPiece === 'I') tryTable = srsTable[13];
            else tryTable = srsTable[5];
        }else if(nextRotation === 0) {
            // L -> 0
            if(currentPiece === 'I') tryTable = srsTable[14];
            else tryTable = srsTable[6];
        }else {
            // L -> R
        }
    }

    let nextPos = [[], [], [], []];
    let nextCoordinate = []; // this is only useful when kick is successful
    for(let i=0;i < 4;i++) {
        nextCoordinate[i] = tryTable[i] + verticalPosition + horizontalPosition;
        for(let j=0;j < 4;j++) {
            nextPos[i][j] = nextCoordinate[i] + currentPiece[nextRotation][j];
        }
    }
    for(let test=0;test < 4;test++) {
        if(!checkMoveCollision(nextPos[test])) {
            // move the piece
            clearCurrentRender();
            rotation = nextRotation;
            verticalPosition = Math.floor(nextCoordinate[test] / 10) * 10;
            horizontalPosition = nextCoordinate[test] % 10;
            console.log("kick");

            return true; // if the kick succeeded, then move the piece, and return true
        }
    }

    return false; // if all 4 tests failed, don't move the piece and return false
}

function rotate_cw() {
    let rotationNext = rotation;
    if(rotation < 3) rotationNext++;
    else rotationNext = 0;

    if(checkRotateCollision(rotationNext)) {
        srsKick(rotationNext);
        return;
    }

    // all clear, move the piece
    clearCurrentRender();
    rotation = rotationNext;
}
function rotate_ccw() {
    let rotationNext = rotation;
    if(rotation > 0) rotationNext--;
    else rotationNext = 3;

    if(checkRotateCollision(rotationNext)) {
        srsKick(rotationNext);
        return;
    }

    clearCurrentRender();
    rotation = rotationNext;
}
function rotate_180() {
    let rotationNext = (rotation + 2) % 4;

    if(checkRotateCollision(rotationNext)) {
        return;
    }

    clearCurrentRender();
    rotation = rotationNext;
}
function move_left() {
    let nextPos = [];
    for(let i=0;i < 4;i++) {
        nextPos[i] = currentPiece[rotation][i] + verticalPosition + horizontalPosition - 1;
    }
    if(checkMoveCollision(nextPos)) {
        return;
    }

    // all clear, move the piece
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = ""; }
    horizontalPosition--;
}
function move_right() {
    let nextPos = [];
    for(let i=0;i < 4;i++) {
        nextPos[i] = currentPiece[rotation][i] + verticalPosition + horizontalPosition + 1;
    }
    if(checkMoveCollision(nextPos)) {
        return;
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
    placePiece();
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

function placePiece() {
    lineClear();
    spawnPiece();
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

// first spawn
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