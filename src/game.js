// --- src/game.js (VERSIÓN FINAL Y CORREGIDA) ---

import * as CONFIG from "./config.js";
import * as UI from "./ui.js";
import * as Snake from "./snake.js";
import * as Food from "./food.js";
import * as Input from "./input.js";
import * as Effects from "./effects.js";

const canvas = document.getElementById("gameCanvas");
const gameContainer = document.getElementById("gameContainer");
const ctx = canvas.getContext("2d");

const gameState = {
  score: 0,
  snakeSpeed: 0,
  highScore: 0,
  box: CONFIG.BASE_BOX_SIZE,
  gridWidth: 0,
  gridHeight: 0,
  status: "MENU",
  newHighScore: false,
  options: { difficulty: CONFIG.DEFAULT_DIFFICULTY },
};

let lastFrameTime = 0;
let timeSinceLastTick = 0;

function initGame() {
  // === LA CORRECCIÓN CLAVE ===
  // Inicializamos la UI para asegurarnos de que todos los elementos del DOM
  // han sido encontrados antes de intentar usarlos.
  UI.initUI();
  // === FIN DE LA CORRECCIÓN ===

  UI.setupMenu(handlePlayButtonClick, handleOptionChange);
  UI.setupPauseMenu(handlePause, setupAndResizeGame);
  UI.setupGameOverMenu(handlePlayAgain, setupAndResizeGame);
  Input.setupInput(handleDirectionChange, handlePause);
  window.addEventListener("resize", setupAndResizeGame);

  setupAndResizeGame();
  window.requestAnimationFrame(mainLoop);
}

function handleOptionChange(setting, value) {
  if (gameState.options[setting] !== undefined) {
    gameState.options[setting] = value;
    setupAndResizeGame();
  }
}

function handlePlayButtonClick() {
  gameState.status = "PLAYING";
  UI.hideMenu();
  restartGame();
  lastFrameTime = 0;
  timeSinceLastTick = 0;
}

function handlePlayAgain() {
  UI.hideGameOverMenu();
  gameState.status = "PLAYING";
  restartGame();
  lastFrameTime = 0;
  timeSinceLastTick = 0;
}

function setupAndResizeGame() {
  if (gameState.status !== "MENU") {
    gameState.status = "MENU";
    UI.showMenu();
  }

  UI.hidePauseMenu();
  UI.hideGameOverMenu();

  const containerWidth = gameContainer.clientWidth;
  const containerHeight = gameContainer.clientHeight;
  const pixelRatio = window.devicePixelRatio || 1;
  gameState.gridWidth = Math.floor(containerWidth / CONFIG.BASE_BOX_SIZE);
  gameState.gridHeight = Math.floor(containerHeight / CONFIG.BASE_BOX_SIZE);
  const boxWidth = containerWidth / gameState.gridWidth;
  const boxHeight = containerHeight / gameState.gridHeight;
  gameState.box = Math.floor(Math.min(boxWidth, boxHeight));
  const logicalWidth = gameState.gridWidth * gameState.box;
  const logicalHeight = gameState.gridHeight * gameState.box;
  canvas.width = logicalWidth * pixelRatio;
  canvas.height = logicalHeight * pixelRatio;
  canvas.style.width = `${logicalWidth}px`;
  canvas.style.height = `${logicalHeight}px`;
  ctx.resetTransform();
  ctx.scale(pixelRatio, pixelRatio);
  gameState.highScore = getHighScore();
  UI.updateHighScoreDisplay(gameState.highScore);
  restartGame();
}

function restartGame() {
  gameState.score = 0;
  gameState.snakeSpeed =
    CONFIG.GAME_SETTINGS.difficulty[gameState.options.difficulty];
  gameState.newHighScore = false;
  UI.updateScoreDisplay(gameState.score);
  const startX = Math.floor(gameState.gridWidth / 2);
  const startY = Math.floor(gameState.gridHeight / 2);
  Snake.initSnake(startX, startY, gameState.box);
  Food.generateFood(
    gameState.box,
    Snake.getSnakeBody(),
    gameState.gridWidth,
    gameState.gridHeight
  );
}

function mainLoop(currentTime) {
  window.requestAnimationFrame(mainLoop);

  if (lastFrameTime === 0) {
    lastFrameTime = currentTime;
    return;
  }

  const deltaTime = currentTime - lastFrameTime;
  lastFrameTime = currentTime;

  if (gameState.status === "PLAYING") {
    timeSinceLastTick += deltaTime;
    const timePerTick = 1000 / gameState.snakeSpeed;
    if (timeSinceLastTick >= timePerTick) {
      timeSinceLastTick %= timePerTick;
      update();
    }
  }

  const progress =
    gameState.status === "PLAYING"
      ? timeSinceLastTick / (1000 / gameState.snakeSpeed)
      : 1.0;
  draw(progress);
}

function handlePause() {
  if (gameState.status === "PLAYING") {
    gameState.status = "PAUSED";
    UI.updateGameInfo(gameState.options);
    UI.showPauseMenu();
  } else if (gameState.status === "PAUSED") {
    gameState.status = "PLAYING";
    UI.hidePauseMenu();
    lastFrameTime = 0;
  }
}

function handleDirectionChange(dx, dy) {
  if (gameState.status === "PLAYING") {
    Snake.setDirection(dx * gameState.box, dy * gameState.box, gameState.box);
  }
}

function update() {
  Effects.updateEffects();
  const logicalWidth = gameState.gridWidth * gameState.box;
  const logicalHeight = gameState.gridHeight * gameState.box;
  if (Snake.checkCollision(logicalWidth, logicalHeight)) {
    checkAndSaveHighScore();
    gameState.status = "GAME_OVER";
    UI.showGameOverMenu(
      gameState.score,
      gameState.highScore,
      gameState.newHighScore
    );
    return;
  }
  const snakeHead = Snake.getSnakeHead();
  const foodPos = Food.getFoodPosition();
  const hasEatenFood = snakeHead.x === foodPos.x && snakeHead.y === foodPos.y;
  Snake.updateSnake(hasEatenFood);
  if (hasEatenFood) {
    Effects.createEatEffect(foodPos.x, foodPos.y, gameState.box);
    gameState.score++;
    UI.updateScoreDisplay(gameState.score);
    if (
      gameState.score > 0 &&
      gameState.score % CONFIG.SPEED_INCREMENT_INTERVAL === 0
    ) {
      gameState.snakeSpeed += CONFIG.SPEED_INCREMENT;
    }
    Food.generateFood(
      gameState.box,
      Snake.getSnakeBody(),
      gameState.gridWidth,
      gameState.gridHeight
    );
  }
  Food.updateFood();
}

function drawGrid() {
  const logicalWidth = gameState.gridWidth * gameState.box;
  const logicalHeight = gameState.gridHeight * gameState.box;
  ctx.strokeStyle = "#2C3E50";
  ctx.lineWidth = 1 / (window.devicePixelRatio || 1);
  for (let x = 0; x <= logicalWidth; x += gameState.box) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, logicalHeight);
    ctx.stroke();
  }
  for (let y = 0; y <= logicalHeight; y += gameState.box) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(logicalWidth, y);
    ctx.stroke();
  }
}

function draw(progress = 1.0) {
  const logicalWidth = canvas.width / (window.devicePixelRatio || 1);
  const logicalHeight = canvas.height / (window.devicePixelRatio || 1);
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);
  drawGrid();

  if (gameState.status !== "MENU") {
    Food.drawFood(ctx, gameState.box);
    Snake.drawSnake(ctx, gameState.box, progress);
  }

  Effects.drawEffects(ctx);
}

function getHighScore() {
  return parseInt(localStorage.getItem(CONFIG.HIGH_SCORE_KEY) || "0", 10);
}

function checkAndSaveHighScore() {
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    localStorage.setItem(CONFIG.HIGH_SCORE_KEY, gameState.highScore);
    gameState.newHighScore = true;
    UI.updateHighScoreDisplay(gameState.highScore);
  }
}

export { initGame };
