
            var canvas = document.getElementById('game');
            var context = canvas.getContext('2d');
            const Text = document.getElementById("text");
            const GameoverText = document.getElementById("gameover");
            var grid = 16;
            var count = 0;
            var speed = 8;
            var score = 0;
            var highscore = 0;
            var Directionlock = 0;
            var GameOverTimer = 0;
            var snake = {x:400, y:400, dx: grid, dy:0, cells: [6],maxCells: 8};
            var apple = {x:220, y: 220};
            UpdateScore(-1);
            RandomizeApple();
            function gameLoop()
            {
                if(GameOverTimer > 0)
                {
                    GameOverTimer -= 0.006;
                    GameoverText.innerHTML = GameOverTimer > 0 ? "Gameover " + (GameOverTimer).toFixed(0).toString() : "";
                    if(GameOverTimer <= 0)
                    {
                        snake.x = 400;
                        snake.y = 400;
                        snake.cells = [];
                        snake.maxCells = 4;
                        snake.dx = grid;
                        snake.dy = 0;
                        RandomizeApple();
                        UpdateScore(-1);
                    }
                }else
                {
                    InputManagement();
                    ClearCanvas();
                    Movement();
                    DrawGameFrame();
                }
                requestAnimationFrame(gameLoop);
            }
            function UpdateScore(amount) {
                score = amount > 0 ? score + amount : 0;
                highscore = score > highscore ? score : highscore;
                Text.textContent = "Score: " + score + "    Highscore: "  + highscore + "       Speed: " + speed;    
            }
            function RandomizeApple() {
                apple.x = Math.floor(Math.random() * 50) * grid; apple.y = Math.floor(Math.random() * 50) * grid;
            }
            function GameOver() {
                GameOverTimer = 2;
            }
            function ClearCanvas() {
                context.clearRect(0,0,canvas.width, canvas.height);
            }
            function DrawGameFrame() {
                context.fillStyle = 'red';
                context.beginPath();
                context.arc(apple.x + grid/2, apple.y + grid/2, grid/2 - 1, 0, Math.PI * 2);
                context.fill();
                context.fillStyle = 'gray';
                snake.cells.forEach(function(cell, index)
                {
                    context.fillRect(cell.x, cell.y, grid-1, grid-1);
                    if(cell.x === apple.x && cell.y === apple.y)
                    {
                        snake.maxCells += 2;
                        UpdateScore(2);
                        RandomizeApple();
                    }
                    for (var i = index + 1; i < snake.cells.length; i++)
                        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y)
                            GameOver();
                });
            }
            function Movement() {
                if(++count < speed)
                    return;
                if(Directionlock > 0)
                    Directionlock --;
                count = 0;
                snake.x += snake.dx;
                snake.y += snake.dy;
                if(snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height)
                    GameOver();
                snake.cells.unshift({x:snake.x, y:snake.y});
                if(snake.cells.length > snake.maxCells)
                    snake.cells.pop();
            }
            
            function InputManagement() {
  document.addEventListener('keydown', function(e) {
    if (Directionlock === 0 && (e.code === "ArrowLeft" && snake.dx === 0 || e.code === "ArrowRight" && snake.dx === 0)) {
      Directionlock = 1;
      snake.dx = e.code === "ArrowLeft" ? -grid : grid;
      snake.dy = 0;
    } else if (Directionlock === 0 && (e.code === "ArrowUp" && snake.dy === 0 || e.code === "ArrowDown" && snake.dy === 0)) {
      Directionlock = 1;
      snake.dy = e.code === "ArrowUp" ? -grid : grid;
      snake.dx = 0;
    }
    if (e.code === "KeyE" || e.code === "KeyQ") {
      speed = (e.code === "KeyE" && speed > 4 ? speed - 1 : e.code === "KeyQ" && speed < 9 ? speed + 1 : speed);
    }
  });
}

            gameLoop();