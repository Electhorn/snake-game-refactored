// --- src/input.js (Reemplazado con lógica de Swipe) ---

let onDirectionChangeCallback = null;
let onPauseCallback = null;

// Variables para detectar el swipe
let touchStartX = 0;
let touchStartY = 0;
let swipeHandled = false; // Para asegurar que un solo swipe no cambie la dirección varias veces

const SWIPE_THRESHOLD = 30; // Mínimo de píxeles de desplazamiento para considerarlo un swipe

function handleDirectionChange(newDx, newDy) {
  if (onDirectionChangeCallback) {
    onDirectionChangeCallback(newDx, newDy);
  }
}

// --- Lógica de Teclado (sin cambios) ---
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

// --- Nueva Lógica Táctil (Swipe) ---

function handleTouchStart(event) {
  // Evita el scroll en la página al tocar el área del juego
  event.preventDefault();

  // Guardamos la posición inicial del primer dedo que toca la pantalla
  const firstTouch = event.touches[0];
  touchStartX = firstTouch.clientX;
  touchStartY = firstTouch.clientY;
  swipeHandled = false; // Reseteamos el manejador para el nuevo swipe
}

function handleTouchMove(event) {
  event.preventDefault();

  // Si no hay un toque inicial o ya procesamos este swipe, no hacemos nada
  if (!touchStartX || !touchStartY || swipeHandled) {
    return;
  }

  const touch = event.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  // Comprobamos si el swipe es principalmente horizontal o vertical
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Swipe horizontal
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      handleDirectionChange(deltaX > 0 ? 1 : -1, 0); // Derecha o Izquierda
      swipeHandled = true; // Marcamos como procesado
    }
  } else {
    // Swipe vertical
    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      handleDirectionChange(0, deltaY > 0 ? 1 : -1); // Abajo o Arriba
      swipeHandled = true; // Marcamos como procesado
    }
  }
}

function handleTouchEnd(event) {
  event.preventDefault();
  // Reseteamos las coordenadas iniciales para preparar el próximo swipe
  touchStartX = 0;
  touchStartY = 0;
}

function setupTouchInput() {
  // Escuchamos los eventos en el contenedor principal del juego
  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) {
    gameContainer.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    gameContainer.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    gameContainer.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });
  }
}

// La firma de setupInput se mantiene igual
export function setupInput(directionCallback, pauseCallback) {
  onDirectionChangeCallback = directionCallback;
  onPauseCallback = pauseCallback;
  document.addEventListener("keydown", handleKeyDown);
  setupTouchInput(); // Llamamos a la nueva función de configuración táctil
}
