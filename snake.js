/*start the game*/

/*spawn the field*/
//the field width and height is not a pixels - this is cell counts
const fieldWidth = 20;
const fieldHeight = 20;
//pixel size of the one cell (calibre)
const cellsize = 10;

//the field where snake lives
const fieldDiv = document.createElement("div");
fieldDiv.className = "field";
fieldDiv.style.width = fieldWidth * cellsize + "px";
fieldDiv.style.height = fieldHeight * cellsize + "px";
document.body.appendChild(fieldDiv);


//special functions to operate with coordinates and cell ID
function TransformIDToCoordinates(id, width, height) {
    let oX = Math.trunc(id / width);
    let oY = id % width;
    return [oX, oY];
}

function TransformCoordinatesToId(coordinates, width) {
    return coordinates[1] * width + coordinates[0];
}

/*fill field*/
let cellsCount = 0;

function StartNewGame() {
    if (cellsCount === 0) {
        //create all new divs in the field
        for (let i = 0; i < fieldWidth * fieldHeight; i++) {
            cellDiv = document.createElement("div");
            cellDiv.className = "cell";
            cellDiv.id = i;
            cellDiv.coordinates = TransformIDToCoordinates(i, fieldWidth, fieldHeight);
            cellDiv.style.width = cellsize + "px";
            cellDiv.style.height = cellsize + "px";
            fieldDiv.appendChild(cellDiv);
            cellsCount++;
        }
    } else {
        //get all divs and make them cell class
        let cellList = [...fieldDiv.childNodes];
        cellList.map((cellDiv) => { cellDiv.className = "cell"; });
    }
}



//ok let make some food 
function makeFood() {
    let maxCellNumber = fieldWidth * fieldHeight;
    let randomCell = Math.floor(Math.random() * maxCellNumber);
    let cellDiv = document.getElementById(randomCell);
    if (cellDiv.className != "cell") makeFood();
    else {
        cellDiv.className = "food";
    }
}
//bonus, Let make this game more interesting
let achievements = [{
        score: 2,
        text: "Ok, I can see you know the rules of this game!",
    },
    {
        score: 10,
        text: "first 10 - Go go champion!",
    },
    {
        score: 13,
        text: "Hell thirteen - let's give this apple to Eve",
    },
    {
        score: 18,
        text: "Stop eating after 18:00 !!!",
    },
    {
        score: 21,
        text: "Now you can buy Tequila!",
    },
    {
        score: 50,
        text: "How can you do that?!!!",
    },
    {
        score: 100,
        text: "F..k this is ANACONDA",
    },
];
//score counter
let Score = {
    scoreCount: 0,
    startScore() {
        this.scoreDiv = document.createElement("div");
        document.body.appendChild(this.scoreDiv);
        this.scoreDiv.className = "score";
        this.scoreDiv.innerHTML = "Your score is <span class='scoreNum'>" + this.scoreCount + "</span>";
        this.achivDiv = document.createElement("div");
        this.achivDiv.innerHTML = "<p>Your achievements:</p>";
        document.body.appendChild(this.achivDiv);
    },
    UpScore() {
        this.scoreCount++;
        this.scoreDiv.innerHTML = "Your score is <span class='scoreNum'>" + this.scoreCount + "</span>";
        let lookForAchiv = achievements.filter(x => x.score === this.scoreCount);
        if (lookForAchiv.length > 0) {
            this.achivDiv.innerHTML += "<p>" + lookForAchiv[0].text + "</p>";
        }
    },
    ZeroScore() {
        this.scoreCount = 0;
        this.scoreDiv.innerHTML = "Your score is <span class='scoreNum'>" + this.scoreCount + "</span>";
    }
};
/* snake object*/
//coordinatets start from [0,0]
// Controls: 
// 4-left
// 8-up
// 6-right
// 2-down

let snake = {
    snakeBody: [
        [1, 3],
        [1, 2],
        [1, 1]
    ],
    direction: 2,
    speed: 0.5,
    pauseGame: false,
    drawSnake() {
        this.snakeBody.map(function(el) {
            let divId = TransformCoordinatesToId(el, fieldWidth);
            let snakeBodyCell = document.getElementById(divId);
            snakeBodyCell.className = "snakeBody";
        })
    },
    moveSnake() {
        let newPosition;
        switch (this.direction) {
            case 2:
                newPosition = [this.snakeBody[0][0], (this.snakeBody[0][1] + 1)];
                break;
            case 4:
                newPosition = [this.snakeBody[0][0] - 1, this.snakeBody[0][1]];
                break;
            case 6:
                newPosition = [this.snakeBody[0][0] + 1, this.snakeBody[0][1]];
                break;
            case 8:
                newPosition = [this.snakeBody[0][0], (this.snakeBody[0][1] - 1)];
                break;
        };
        //console.log(this.snakeBody);
        //check the new step if the field ends  - snake must die :(
        if (newPosition[0] < 0 || newPosition[0] >= fieldWidth || newPosition[1] < 0 || newPosition[1] >= fieldHeight) {
            alert("stop killing the snake!!!");
            this.KillSnake();
            return;
        }
        //if the snake it her tail she also die :( 
        let newPositionID = TransformCoordinatesToId(newPosition, fieldWidth);
        if (document.getElementById(newPositionID).className == "snakeBody") {
            alert("the snake make some suicide");
            this.KillSnake();
            return;
        }
        this.snakeBody.unshift(newPosition);
        if (document.getElementById(newPositionID).className == "food") {
            makeFood();
            Score.UpScore();
        } else {
            let delCoordinates = this.snakeBody.pop();
            let delId = TransformCoordinatesToId(delCoordinates, fieldWidth);
            document.getElementById(delId).className = "cell";
        }
        this.drawSnake();
    },
    changeDirection(dir) {
        this.direction = dir;
    },
    AutoMove() {
        this.move = setInterval(() => {
            snake.moveSnake();
        }, this.speed * 1000)
    },
    PauseMove() {
        if (this.pauseGame) {
            this.AutoMove();

        } else {
            clearInterval(this.move);
        }
        this.pauseGame = !(this.pauseGame);
    },
    KillSnake() {
        //back to start position and move direction
        clearInterval(this.move);
        this.snakeBody = [
            [1, 3],
            [1, 2],
            [1, 1]
        ];
        this.direction = 2;
        //fill the field
        StartNewGame();
        this.drawSnake();
        snake.AutoMove();
        makeFood();
        Score.ZeroScore();
    }
}

//key event controller



document.addEventListener("keydown", function(myKey) {
    // console.log(myKey);
    if (myKey.code == "Numpad2" || myKey.code == "ArrowDown" || myKey.code == "KeyS") {
        snake.changeDirection(2);
    }
    if (myKey.code == "Numpad4" || myKey.code == "ArrowLeft" || myKey.code == "KeyA") {
        snake.changeDirection(4);
    }
    if (myKey.code == "Numpad6" || myKey.code == "ArrowRight" || myKey.code == "KeyD") {
        snake.changeDirection(6);
    }
    if (myKey.code == "Numpad8" || myKey.code == "ArrowUp" || myKey.code == "KeyW") {
        snake.changeDirection(8);
    }
    if (myKey.code == "Space") {
        snake.PauseMove();
    }
});


//first start
StartNewGame();
snake.drawSnake();
snake.AutoMove();
makeFood();
Score.startScore();