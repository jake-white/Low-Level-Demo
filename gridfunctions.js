let xToGrid = function(x) {
    if(x < horLeft) return 0;
    if(x < horMid) return 1;
    if(x < horRight) return 2;
}

let yToGrid = function(y) {
    if(y < vertTop) return 0;
    if(y < vertMid) return 1;
    if(y < vertBottom) return 2;
}

let gridToX = function(gridX) {
    let x = 0;
    if(gridX == 0) {
        x = horLeft/2;
    }
    else if(gridX == 1) {
        x = horLeft + (horMid - horLeft)/2;
    }
    else if(gridX == 2) {
        x = horMid + (horRight - horMid)/2;
    }
    return x;
}
let gridToY = function(gridY) {
    let y = 0;
    if(gridY == 0) {
        y = vertTop/2;
    }
    else if(gridY== 1) {
        y = vertTop + (vertMid - vertTop)/2;
    }
    else if(gridY == 2) {
        y = vertMid + (vertBottom - vertMid)/2;
    }
    return y;
}