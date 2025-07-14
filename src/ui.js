// --- src/ui.js (VERSIÓN FINAL Y ROBUSTA) ---

// 1. Declaramos las variables aquí, pero no las asignamos.
let scoreElement,
  highScoreElement,
  menuOverlay,
  playButton,
  menuOptionsContainer,
  pauseOverlay,
  gameInfoContainer,
  resumeButton,
  restartFromPauseButton,
  gameOverOverlay,
  gameOverTitle,
  finalScoresContainer,
  playAgainButton,
  mainMenuButton;

// 2. Creamos una función de inicialización que se llamará una sola vez.
export function initUI() {
  scoreElement = document.getElementById("scoreValue");
  highScoreElement = document.getElementById("highScoreValue");
  menuOverlay = document.getElementById("menuOverlay");
  playButton = document.getElementById("playButton");
  menuOptionsContainer = document.querySelector(".menu-options");
  pauseOverlay = document.getElementById("pauseOverlay");
  gameInfoContainer = document.getElementById("gameInfo");
  resumeButton = document.getElementById("resumeButton");
  restartFromPauseButton = document.getElementById("restartFromPauseButton");
  gameOverOverlay = document.getElementById("gameOverOverlay");
  gameOverTitle = document.getElementById("gameOverTitle");
  finalScoresContainer = document.getElementById("finalScores");
  playAgainButton = document.getElementById("playAgainButton");
  mainMenuButton = document.getElementById("mainMenuButton");
}

// 3. El resto de las funciones ahora usarán las variables que initUI() ha llenado.
export function setupMenu(playCallback, optionsCallback) {
  playButton.addEventListener("click", playCallback);
  menuOptionsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const { setting, value } = e.target.dataset;
      const siblings = e.target.parentElement.querySelectorAll("button");
      siblings.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      optionsCallback(setting, value);
    }
  });
}

export function showMenu() {
  menuOverlay.classList.remove("hidden");
}
export function hideMenu() {
  menuOverlay.classList.add("hidden");
}

export function updateScoreDisplay(score) {
  scoreElement.textContent = score;
}
export function updateHighScoreDisplay(highScore) {
  highScoreElement.textContent = highScore;
}

export function setupPauseMenu(resumeCallback, restartCallback) {
  resumeButton.addEventListener("click", resumeCallback);
  restartFromPauseButton.addEventListener("click", restartCallback);
}

export function showPauseMenu() {
  pauseOverlay.classList.remove("hidden");
}
export function hidePauseMenu() {
  pauseOverlay.classList.add("hidden");
}

export function updateGameInfo(options) {
  const difficulty =
    options.difficulty.charAt(0).toUpperCase() + options.difficulty.slice(1);
  gameInfoContainer.innerHTML = `<div>Dificultad: <span>${difficulty}</span></div>`;
}

export function setupGameOverMenu(playAgainCallback, mainMenuCallback) {
  playAgainButton.addEventListener("click", playAgainCallback);
  mainMenuButton.addEventListener("click", mainMenuCallback);
}

export function showGameOverMenu(score, highScore, isNewRecord) {
  if (isNewRecord) {
    gameOverTitle.textContent = "¡Nuevo Récord!";
    gameOverTitle.classList.add("new-record");
  } else {
    gameOverTitle.textContent = "¡Has perdido!";
    gameOverTitle.classList.remove("new-record");
  }
  finalScoresContainer.innerHTML = `
    <div>Puntuación: <span>${score}</span></div>
    <div>Mejor: <span>${highScore}</span></div>
  `;
  gameOverOverlay.classList.remove("hidden");
}

export function hideGameOverMenu() {
  gameOverOverlay.classList.add("hidden");
}

export function showTouchControls() {
  touchControls.classList.add("visible");
}
export function getTouchControlsElement() {
  return touchControls;
}

export function updateArrowActiveState(direction) {
  upArrow.classList.toggle("active", direction === "up");
  downArrow.classList.toggle("active", direction === "down");
  leftArrow.classList.toggle("active", direction === "left");
  rightArrow.classList.toggle("active", direction === "right");
}

// El botón de reinicio viejo ya no se usa, pero dejamos las funciones por si acaso.
export function showRestartButton() {
  /* No-op */
}
export function hideRestartButton() {
  /* No-op */
}
