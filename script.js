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





let gameSpace = [''];
while(gameSpace.length < 200) { gameSpace.push(''); }
console.log(gameSpace);





const gridsContainer = document.querySelector('#gridsContainer')
for(let i=0;i < 200;i++) {
    let newDiv = gridsContainer.appendChild(document.createElement("div"));
    newDiv.classList.add("grid");
}
let grids = Array.from(document.querySelectorAll('#gridsContainer div'))

document.addEventListener('DOMContentLoaded', () => {
    console.log(grids);
})






function render() {
    for(let i=0; i < 200 ;i++) {
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
                grids[i].className = "grid";
                break;
        }
    }
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
        let nextNo = Number(currentPiece[rotation][i] + verticalPosition + horizontalPosition + 10);
        if(nextNo > 199) { return false; } //stop function if any of the piece will go out of range
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
            if (isClipping) { return false }; // if the piece will be clipping after movement
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
    horizontalPosition = 3;
    verticalPosition = -10;
    rotation = 0;
    setCurrentPiece("L")
}


let rotation = 0;
let horizontalPosition = 3; // x coordinate
let verticalPosition = -10; // always 10's multiple



function update() {
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = ""; }
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = currentColor; }

    if(verticalPosition >= 180) spawnPiece();
    //if(verticalPosition >= 180) clearInterval(intervalID);
}


let lastUpdate = Date.now();
let intervalID = setInterval(tick, 0);
let delay = 0;


spawnPiece();

function tick() {
    let now = Date.now();
    let dt = now - lastUpdate;
    lastUpdate = now;
    delay += dt;

    if(delay >= 500) {
        moveDown();
        delay = 0;
    }

    update();
    render();
}