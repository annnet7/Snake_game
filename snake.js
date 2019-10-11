/*start the game*/

/*spawn the field*/
const fieldWidth = 50;
const fieldHeight = 50;
const cellsize = 10;
const fieldDiv = document.createElement("div");
fieldDiv.className = "field";
fieldDiv.style.width = fieldWidth * cellsize + "px";
fieldDiv.style.height = fieldHeight * cellsize + "px";
document.body.appendChild(fieldDiv);


/*fill field*/
function TransformIDToCoordinates(id, width, height) {
    let oX = Math.trunc(id / width);
    let oY = id % width;
    return [oX, oY];
}

function TransformCoordinatesToId(coordinates, width) {
    return coordinates[1] * width + coordinates[0];
}
function StartNewGame(){
    for (let i = 0; i < fieldWidth * fieldHeight; i++) {
        cellDiv = document.createElement("div");
        cellDiv.className = "cell";
        cellDiv.id = i;
        cellDiv.coordinates = TransformIDToCoordinates(i, fieldWidth, fieldHeight);
        cellDiv.style.width = cellsize + "px";
        cellDiv.style.height = cellsize + "px";
        fieldDiv.appendChild(cellDiv);
    }
}
StartNewGame();



/* snake object*/
//coordinatets start from [0,0]
// direction: 
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
        //check the new step
        if(newPosition[0]<0 || newPosition[0]>=fieldWidth || newPosition[1]<0 || newPosition[1]>=fieldHeight)
        {
            alert("dead");     
            this.KillSnake();    
            return;  
        }
        let newCoordinates = TransformCoordinatesToId(newPosition, fieldWidth);
        if (document.getElementById(newCoordinates).className!="cell"){            
            alert("dead");  
            this.KillSnake();       
            return;  
        }
        //
        this.snakeBody.unshift(newPosition);
        let delCoordinates = this.snakeBody.pop();
        let delId = TransformCoordinatesToId(delCoordinates, fieldWidth);
        document.getElementById(delId).className = "cell";
        this.drawSnake();
    },
    changeDirection(dir) {
        this.direction = dir;
    },
    AutoMove() {
        this.move = setInterval(()=>{
            snake.moveSnake();
        },1000)
    },
    KillSnake() {
        clearInterval(this.move);
        this.snakeBody= [
            [1, 3],
            [1, 2],
            [1, 1]
        ];
    }
}




////
snake.drawSnake();
snake.AutoMove();




document.addEventListener("keydown", function(myKey) {
    //console.log(myKey);
    if(myKey.code == "Numpad2" || myKey.code == "ArrowDown" || myKey.code == "KeyS"){
        snake.changeDirection(2);
    }
    if(myKey.code == "Numpad4" || myKey.code == "ArrowLeft"  || myKey.code == "KeyA"){
        snake.changeDirection(4);
    }
    if(myKey.code == "Numpad6" || myKey.code == "ArrowRight"  || myKey.code == "KeyD"){
        snake.changeDirection(6);
    }
    if(myKey.code == "Numpad8" || myKey.code == "ArrowUp"  || myKey.code == "KeyW"){
        snake.changeDirection(8);
    }    
    //snake.moveSnake();
});


