const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let gameMode = "normal"; // 'normal', 'speed'
let gameStarted = false;
let paused = false;
const baseBallSpeed = 4;
let player1Name = "";
let player2Name = "";


let currentSpeedMultiplier = 1;
const speedIncreaseRate = {
  normal: 0.2,
  speed: 0.35
};



// Paddle properties
const paddleWidth = 10;
const paddleHeight = 100;
const paddleSpeed = 7;

const leftPaddle = {
  x: 20,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0
};

const rightPaddle = {
  x: canvas.width - 20 - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0
};

const ballRadius = 10;
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dx: 4 * (Math.random() > 0.5 ? 1 : -1),
  dy: 4 * (Math.random() > 0.5 ? 1 : -1)
};

let leftScore = 0;
let rightScore = 0;
function submitNames() {
    const name1 = document.getElementById("player1Input").value.trim();
    const name2 = document.getElementById("player2Input").value.trim();
  
    if (!name1 || !name2) {
      alert("Please enter names for both players!");
      return;
    }
  
    player1Name = name1;
    player2Name = name2;
  
    document.getElementById("nameScreen").style.display = "none";
    document.getElementById("startMenu").style.display = "flex";
  
    // Optional: update player name labels if used elsewhere
    document.getElementById("reactionPlayer1").textContent = player1Name;
    document.getElementById("reactionPlayer2").textContent = player2Name;
  }
  
  
document.getElementById("reactionPlayer1").textContent = player1Name;
document.getElementById("reactionPlayer2").textContent = player2Name;


function clearScoreMessage() {
    if (scoreMessageTimeout) {
      clearTimeout(scoreMessageTimeout);
      scoreMessageTimeout = null;
    }
    document.getElementById("scoreMessage").style.display = "none";
  }

  
function togglePause() {
    paused = !paused;
    document.getElementById("pauseBtn").textContent = paused ? "Resume" : "Pause";
  }
  
// Draw a paddle
function drawPaddle(paddle) {
  ctx.fillStyle = "white";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function drawScores() {
  ctx.font = "32px Arial";
  ctx.fillText(leftScore, canvas.width / 4, 50);
  ctx.fillText(rightScore, canvas.width * 3 / 4, 50);
}

// Reset the ball after a score
function resetBall(speedMultiplier = 1) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  
    currentSpeedMultiplier = speedMultiplier;
  
    const speed = baseBallSpeed * currentSpeedMultiplier;
  
    ball.dx = speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = speed * (Math.random() > 0.5 ? 1 : -1);
  }
  
  
  

// Update game objects
function update() {
    // Move paddles
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
  
    // Clamp paddles inside canvas
    leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
    rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));
  
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
  
    // Bounce off top and bottom
    if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
      ball.dy = -ball.dy;
    }
  
    // Paddle collision - LEFT
    if (
      ball.x - ballRadius < leftPaddle.x + leftPaddle.width &&
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + leftPaddle.height
    ) {
      currentSpeedMultiplier += speedIncreaseRate[gameMode];
      const speed = baseBallSpeed * currentSpeedMultiplier;
      ball.dx = Math.abs(speed); // move right
    }
  
    // Paddle collision - RIGHT
    if (
      ball.x + ballRadius > rightPaddle.x &&
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + rightPaddle.height
    ) {
      currentSpeedMultiplier += speedIncreaseRate[gameMode];
      const speed = baseBallSpeed * currentSpeedMultiplier;
      ball.dx = -Math.abs(speed); // move left
    }
  
   // Score logic
if (ball.x - ballRadius < 0) {
    rightScore++;
    resetBall(gameMode === "speed" ? 1.5 : 1);
  } else if (ball.x + ballRadius > canvas.width) {
    leftScore++;
    resetBall(gameMode === "speed" ? 1.5 : 1);
  }
  
  }

  
  

// Draw all game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
    drawScores();
  
    
  }
  
  function showScoreMessage(message) {
    paused = true;
  
    if (!player1Name) player1Name = "Player 1";
    if (!player2Name) player2Name = "Player 2";
  
    document.getElementById("scoreMessage").textContent = message;
    document.getElementById("scoreMessage").style.display = "block";
  
    // Store timeout so we can clear it if needed
    scoreMessageTimeout = setTimeout(() => {
      document.getElementById("scoreMessage").style.display = "none";
      resetBall(gameMode === "speed" ? 1.5 : 1);
      paused = false;
      scoreMessageTimeout = null;
    }, 3000);
  }
  
  

function gameLoop() {
    if (!paused) {
      update();
      draw();
    }
    requestAnimationFrame(gameLoop);
  }
  

//gameLoop();

// Keyboard event listeners
document.addEventListener("keydown", function (e) {
  if (e.key === "w" || e.key === "W") {
    leftPaddle.dy = -paddleSpeed;
  } else if (e.key === "s" || e.key === "S") {
    leftPaddle.dy = paddleSpeed;
  }

  if (e.key === "ArrowUp") {
    rightPaddle.dy = -paddleSpeed;
  } else if (e.key === "ArrowDown") {
    rightPaddle.dy = paddleSpeed;
  }
});

document.addEventListener("keyup", function (e) {
  if (e.key === "w" || e.key === "W" || e.key === "s" || e.key === "S") {
    leftPaddle.dy = 0;
  }
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    rightPaddle.dy = 0;
  }
});
function goToMenu() {
    paused = false;
    gameStarted = false;
  
    // Hide all game screens
    document.getElementById("gameCanvas").style.display = "none";
    document.getElementById("reactionDuel").style.display = "none";
    document.getElementById("clickRace")?.style.display = "none";
  
    // Show menu
    document.getElementById("startMenu").style.display = "flex";
  
    // Hide control buttons
    document.getElementById("pauseBtn").style.display = "none";
    document.getElementById("menuButton").style.display = "none";
  
    // Reset game state
    leftScore = 0;
    rightScore = 0;
    leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
    rightPaddle.y = canvas.height / 2 - paddleHeight / 2;
  
    resetBall(1); // Reset ball to normal speed
  }
  
  
  

  
  

  function startGame(mode) {
    if (!player1Name || !player2Name) {
      alert("Please enter player names first!");
      return;
    }
  
    gameMode = mode;
    leftScore = 0;
    rightScore = 0;
    gameStarted = true;
    paused = false;
  
    currentSpeedMultiplier = (mode === "speed") ? 1.5 : 1;
  
    document.getElementById("startMenu").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    document.getElementById("pauseBtn").style.display = "block";
    document.getElementById("menuButton").style.display = "block";
  
    resetBall(currentSpeedMultiplier);
    gameLoop(); // ⬅ Only start the loop here
  }
  
  
  



// REACTION TIME
//--------------------------
//==========================
//--------------------------
let reactionStartTime = 0;
let player1Score = 0;
let player2Score = 0;

let reactionStarted = false;
let reactionReady = false;
let reactionTimeout;

function openReactionDuel() {
    clearScoreMessage(); // ⬅ stop any leftover pong timeouts
  
    document.getElementById("startMenu").style.display = "none";
    document.getElementById("reactionDuel").style.display = "flex";
    document.getElementById("reactionMessage").textContent = "Get Ready...";
    reactionStarted = false;
    reactionReady = false;
  }
  

function startReactionDuel() {
  document.body.style.backgroundColor = "#c3b091"
  document.getElementById("reactionMessage").textContent = "Wait for it...";
  reactionStarted = true;
  reactionReady = false;

  // Random time between 2–5 seconds
  const delay = Math.random() * 3000 + 2000;
  reactionTimeout = setTimeout(() => {
    document.getElementById("reactionMessage").textContent = "GO!";
    document.body.style.backgroundColor = "green"

    reactionStartTime = Date.now();
    reactionReady = true;
  }, delay);

}

document.addEventListener("keydown", function (e) {
    if (!reactionStarted) return;
  
    const key = e.key.toLowerCase();
  
    // False start
    if (!reactionReady) {
      if (key === "f") {
        document.getElementById("reactionMessage").textContent = `${player1Name} False Start! ${player2Name} Wins!`;
        player2Score++;
        document.getElementById("reactionScore2").textContent = `Score: ${player2Score}`;

      } else if (key === "l") {
        document.getElementById("reactionMessage").textContent = `${player2Name} False Start! ${player1Name} Wins!`;
        player1Score++;
        document.getElementById("reactionScore1").textContent = `Score: ${player1Score}`;

      } else {
        return;
      }
      
      endRound();
      return;
    }
  
    // Valid reaction
    if (reactionReady) {
      const reactionTime = Date.now() - reactionStartTime;
  
      if (key === "f") {
        document.getElementById("reactionMessage").textContent = `${player1Name} Wins!`;
        document.getElementById("reactionTime").textContent = `Reaction Time: ${reactionTime}ms`;
        player1Score++;
      } else if (key === "l") {
        document.getElementById("reactionMessage").textContent = `${player2Name} Wins!`;
        document.getElementById("reactionTime").textContent = `Reaction Time: ${reactionTime}ms`;
        player2Score++;
      }
      document.getElementById("reactionScore1").textContent = `Score: ${player1Score}`;
      document.getElementById("reactionScore2").textContent = `Score: ${player2Score}`;

  
      endRound();
    }
  });
  function endRound() {
    reactionStarted = false;
    reactionReady = false;
    clearTimeout(reactionTimeout);
  
    document.getElementById("reactionScore").textContent = `${player1Name}: ${player1Score} | ${player2Name}: ${player2Score}`;
}
  
  
