// --- src/snake.js (VERSIÓN CORREGIDA Y ROBUSTA) ---

let snake = [];
let dx = 0;
let dy = 0;
let changingDirection = false;

// initSnake ahora es más simple. No necesita pre-calcular prevX/Y.
export function initSnake(startGridX, startGridY, box) {
  const startX = startGridX * box;
  const startY = startGridY * box;

  snake = [];
  for (let i = 0; i < 3; i++) {
    const x = startX - i * box;
    snake.push({
      x: x,
      y: startY,
      prevX: x, // Al inicio, la posición previa es la actual.
      prevY: startY,
    });
  }

  dx = box;
  dy = 0;
  changingDirection = false;
}

// === LÓGICA DE ACTUALIZACIÓN CORREGIDA Y SIMPLIFICADA ===
export function updateSnake(hasEatenFood) {
  changingDirection = false;

  // 1. Guardamos la posición anterior de cada segmento.
  // Esto es crucial para la interpolación.
  for (const segment of snake) {
    segment.prevX = segment.x;
    segment.prevY = segment.y;
  }

  // 2. Movemos el cuerpo de la serpiente.
  // Empezamos desde la cola y hacemos que cada segmento ocupe la posición
  // del que tenía delante.
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }

  // 3. Movemos la cabeza según la dirección actual.
  const head = snake[0];
  head.x += dx;
  head.y += dy;

  // 4. Si ha comido, añadimos un nuevo segmento.
  // Se añade en la posición de la antigua cola.
  if (hasEatenFood) {
    const lastSegment = snake[snake.length - 1];
    snake.push({
      x: lastSegment.prevX,
      y: lastSegment.prevY,
      prevX: lastSegment.prevX,
      prevY: lastSegment.prevY,
    });
  }
}
// === FIN DE LA CORRECCIÓN ===

// drawSnake no cambia, pero ahora funcionará correctamente con los datos actualizados.
export function drawSnake(ctx, box, progress) {
  snake.forEach((segment, index) => {
    // La interpolación ahora funcionará porque prevX/Y y x/y se actualizan correctamente.
    const visualX = segment.prevX + (segment.x - segment.prevX) * progress;
    const visualY = segment.prevY + (segment.y - segment.prevY) * progress;

    const color = index === 0 ? "#1ABC9C" : "#48C9B0";
    ctx.fillStyle = color;
    ctx.fillRect(visualX, visualY, box, box);

    if (index === 0) {
      drawEyes(ctx, box, visualX, visualY);
    }
  });
}

function drawEyes(ctx, box, headX, headY) {
  ctx.fillStyle = "white";
  const eyeSize = Math.max(2, Math.floor(box / 5));

  // La dirección de los ojos ahora se basa en dx y dy, es más simple.
  if (dx > 0) {
    // Derecha
    ctx.fillRect(headX + box - eyeSize * 2, headY + eyeSize, eyeSize, eyeSize);
    ctx.fillRect(
      headX + box - eyeSize * 2,
      headY + box - eyeSize * 2,
      eyeSize,
      eyeSize
    );
  } else if (dx < 0) {
    // Izquierda
    ctx.fillRect(headX + eyeSize, headY + eyeSize, eyeSize, eyeSize);
    ctx.fillRect(headX + eyeSize, headY + box - eyeSize * 2, eyeSize, eyeSize);
  } else if (dy > 0) {
    // Abajo
    ctx.fillRect(headX + eyeSize, headY + box - eyeSize * 2, eyeSize, eyeSize);
    ctx.fillRect(
      headX + box - eyeSize * 2,
      headY + box - eyeSize * 2,
      eyeSize,
      eyeSize
    );
  } else if (dy < 0) {
    // Arriba
    ctx.fillRect(headX + eyeSize, headY + eyeSize, eyeSize, eyeSize);
    ctx.fillRect(headX + box - eyeSize * 2, headY + eyeSize, eyeSize, eyeSize);
  }
}

export function setDirection(newDx, newDy, box) {
  if (changingDirection) return false;
  const goingUp = dy === -box;
  const goingDown = dy === box;
  const goingRight = dx === box;
  const goingLeft = dx === -box;
  if (
    (newDy === -box && goingDown) ||
    (newDy === box && goingUp) ||
    (newDx === -box && goingRight) ||
    (newDx === box && goingLeft)
  ) {
    return false;
  }
  dx = newDx;
  dy = newDy;
  changingDirection = true;
  return true;
}

export function checkCollision(logicalWidth, logicalHeight) {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= logicalWidth ||
    head.y < 0 ||
    head.y >= logicalHeight
  ) {
    return true;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) return true;
  }
  return false;
}

export function getSnakeHead() {
  return snake[0];
}
export function getSnakeBody() {
  return snake;
}
