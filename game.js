let canvas, ctx;
let width, height;
let isMouseDown = false;
let downX = 0, downY = 0;
let upX = 0, upY = 0;
let horLeft, horMid, horRight;
let vertTop, vertMid, vertBottom;
let circles = [];
let crosses = [];
let GameState = {
    InProgress: 0,
    Player: 1,
    AI: 2,
    Tie: 3
}

let start = function() {
    canvas = document.getElementById('surface');
    canvas.onmousedown = function(event) {
        let x = event.pageX - canvas.offsetLeft;
        let y = event.pageY - canvas.offsetTop;
        mousedown(x,y);
    }

    canvas.onmouseup = function(event) {
        let x = event.pageX - canvas.offsetLeft;
        let y = event.pageY - canvas.offsetTop;
        mouseup(x,y);
    }

    canvas.onmousemove = function(event) {
        let x = event.pageX - canvas.offsetLeft;
        let y = event.pageY - canvas.offsetTop;
        mousemove(x,y);
    }
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;

    //width & height get slightly cut off
    width = canvas.width - 50;
    height = canvas.height - 50;
    horLeft = width/3;
    horMid = 2*width/3;
    horRight = width;
    vertTop = height/3;
    vertMid = 2*height/3;
    vertBottom = height;
    setInterval(drawGame, 30);
}

let drawGame = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    //vertical tic tac toe lines
    ctx.moveTo(horLeft, 0);
    ctx.lineTo(horLeft, height);
    ctx.moveTo(horMid, 0);
    ctx.lineTo(horMid, height);

    //horizontal tic tac toe lines
    ctx.moveTo(0, vertTop);
    ctx.lineTo(width, vertTop);
    ctx.moveTo(0, vertMid);
    ctx.lineTo(width, vertMid);
    ctx.closePath();
    ctx.stroke();
    drawCircles();
    drawCrosses();
    drawCurrentCircle();
    if(evaluateGameState() != GameState.InProgress) {
        drawButton();
    }
}

let mousedown = function(x, y) {
    if(evaluateGameState() == GameState.InProgress) {
        downX = x;
        downY = y;
        upX = x;
        upY = y;
        isMouseDown = true;
    }
    else {
        restartGame();
        isMouseDown = false;
    }
}

let mouseup = function(x, y) {
    if(isMouseDown) {
        upX = x;
        upY = y;
        isMouseDown = false;
        let radius = Math.sqrt(Math.pow(Math.abs(upX - downX), 2) + Math.pow(Math.abs(upY - downY), 2));
        let thisCircle = new Circle(downX, downY, radius);
        let isTaken = false;    
        circles.forEach(function(element) {
            if(element.gridX == thisCircle.gridX && element.gridY == thisCircle.gridY) {
                isTaken = true;
            }
        });    
        crosses.forEach(function(element) {
            if(element.gridX == thisCircle.gridX && element.gridY == thisCircle.gridY) {
                isTaken = true;
            }
        });
        if(!isTaken) {
            circles.push(thisCircle);
            drawNewCross();
        }
    }
}

let mousemove = function(x, y) {
    if(isMouseDown) {
        upX = x;
        upY = y;
    }
}

let drawCircles = function() {
    circles.forEach(function(element) {
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.stroke();
    });
}

let drawCrosses = function() {
    crosses.forEach(function(element) {
        ctx.beginPath();
        ctx.moveTo(element.x-element.radius, element.y-element.radius);
        ctx.lineTo(element.x+element.radius, element.y+element.radius);
        ctx.moveTo(element.x+element.radius, element.y-element.radius);
        ctx.lineTo(element.x-element.radius, element.y+element.radius);
        ctx.closePath();
        ctx.stroke();
    });
}

let drawCurrentCircle = function() {
    if(isMouseDown) {
        ctx.beginPath();
        let radius = Math.sqrt(Math.pow(Math.abs(upX - downX), 2) + Math.pow(Math.abs(upY - downY), 2));
        ctx.arc(downX, downY, radius, 0, 2*Math.PI, false);
        ctx.stroke();
        ctx.closePath();
    }
}

let drawNewCross = function() {
    if(evaluateGameState() == GameState.InProgress) {
        let isTaken = true;
        let randomX = 0;
        let randomY = 0;
        while(isTaken) {
            isTaken = false;
            randomX = Math.floor(Math.random()*3);
            randomY = Math.floor(Math.random()*3);
            circles.forEach(function(element) {
                if(element.gridX == randomX && element.gridY == randomY) {
                    isTaken = true;
                }
            });
            crosses.forEach(function(element) {
                if(element.gridX == randomX && element.gridY == randomY) {
                    console.log("cross already there.");
                    isTaken = true;
                }
            });
        }
        crosses.push(new Cross(randomX, randomY, 40));
    }
}

let drawButton = function() {
    ctx.fillStyle = "rgba(255, 50, 150, 0.9)";
    ctx.rect(width/6, 2*height/6, 4*width/6, 2*height/6);
    ctx.fill();

    ctx.font="20px Georgia";
    ctx.fillStyle = "#000000";
    let message = "";
    if(evaluateGameState() == GameState.Player) message = "You won! Click to restart.";
    else if(evaluateGameState() == GameState.AI) message = "You lost... Click to restart.";
    else if(evaluateGameState() == GameState.Tie) message = "It's a tie. Click to restart.";
    ctx.fillText(message, width/6 + 30, 3*height/6 + 5);
}

let evaluateGameState = function() {
    let isWon = false;    
    let isSpaceAvailable = circles.length + crosses.length < 9;
    let grid = [[0,0,0],
                [0,0,0],
                [0,0,0]];
    
    circles.forEach(function(element) {
        grid[element.gridY][element.gridX] = GameState.Player;
    });
    crosses.forEach(function(element) {
        grid[element.gridY][element.gridX] = GameState.AI;
    });

    let winner = GameState.InProgress;
    //horizontal checks
    for(let i = 0; i < 3; ++i) {
        if(grid[i][0] == grid[i][1] && grid[i][0] == grid[i][2] && grid[i][0] != GameState.InProgress) {
            winner = grid[i][0];
        }
    }

    //vertical checks
    for(let i = 0; i < 3; ++i) {
        if(grid[0][i] == grid[1][i] && grid[0][i] == grid[2][i] && grid[0][i] != GameState.InProgress) {
            winner = grid[0][i];
        }
    }

    //diagonal checks
    if(grid[0][0] == grid[1][1] && grid[0][0] == grid[2][2] && grid[0][0] != GameState.InProgress
        || grid[2][0] == grid[1][1] && grid[2][0] == grid[0][2] && grid[2][0] != GameState.InProgress) {
        winner = grid[1][1];
    }

    if(winner == GameState.InProgress && !isSpaceAvailable) winner = GameState.Tie;
    return winner;
}



let restartGame = function() {
    circles = [];
    crosses = [];
}