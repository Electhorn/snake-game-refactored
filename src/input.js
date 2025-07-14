// --- src/input.js (Final y Correcto) ---

let onDirectionChangeCallback = null;
let onPauseCallback = null;

let touchStartX = 0;
let touchStartY = 0;
let swipeHandled = false;

const SWIPE_THRESHOLD = 30;

function handleDirectionChange(newDx, newDy) {
  if (onDirectionChangeCallback) {
    onDirectionChangeCallback(newDx, newDy);
  }
}

function handleKeyDown(event) {
  const keyPressed = event.key.toLowerCase();
  if (keyPressed === "escape") {
    if (onPauseCallback) onPauseCallback();
    return;
  }
  let dx = null,
    dy = null;
  if (keyPressed === "arrowup" || keyPressed === "w") {
    dx = 0;
    dy = -1;
  } else if (keyPressed === "arrowdown" || keyPressed === "s") {
    dx = 0;
    dy = 1;
  } else if (keyPressed === "arrowleft" || keyPressed === "a") {
    dx = -1;
    dy = 0;
  } else if (keyPressed === "arrowright" || keyPressed === "d") {
    dx = 1;
    dy = 0;
  }
  if (dx !== null) {
    handleDirectionChange(dx, dy);
  }
}

// --- Lógica Táctil Corregida ---

function handleTouchStart(event) {
  // NO llamamos a preventDefault aquí para permitir los clics en los botones.
  const firstTouch = event.touches[0];
  touchStartX = firstTouch.clientX;
  touchStartY = firstTouch.clientY;
  swipeHandled = false;
}

function handleTouchMove(event) {
  // SÍ llamamos a preventDefault aquí para evitar el scroll DURANTE el swipe.
  event.preventDefault();

  if (!touchStartX || !touchStartY || swipeHandled) {
    return;
  }
  const touch = event.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      handleDirectionChange(deltaX > 0 ? 1 : -1, 0);
      swipeHandled = true;
    }
  } else {
    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      handleDirectionChange(0, deltaY > 0 ? 1 : -1);
      swipeHandled = true;
    }
  }
}

function handleTouchEnd(event) {
  touchStartX = 0;
  touchStartY = 0;
}

function setupTouchInput() {
  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) {
    gameContainer.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    }); // passive:true es mejor si no prevenimos
    gameContainer.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    }); // passive:false aquí porque SÍ prevenimos
    gameContainer.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });
  }
}

export function setupInput(directionCallback, pauseCallback) {
  onDirectionChangeCallback = directionCallback;
  onPauseCallback = pauseCallback;
  document.addEventListener("keydown", handleKeyDown);
  setupTouchInput();
}
