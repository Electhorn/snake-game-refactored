// --- src/ui.js (VERSIÓN FINAL Y CORREGIDA) ---

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
