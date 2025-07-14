let activeEffects = [];

// Configuración del efecto
const RING_EXPAND_SPEED = 2.5; // Píxeles por frame (lógico)
const RING_FADE_SPEED = 0.05; // Opacidad por frame
const RING_INITIAL_WIDTH = 3; // Grosor inicial de la línea

// Crea un nuevo efecto de anillo en la posición de la comida
export function createEatEffect(x, y, boxSize) {
  activeEffects.push({
    x: x + boxSize / 2, // Centrado en la celda
    y: y + boxSize / 2,
    radius: boxSize / 4, // Empieza pequeño
    alpha: 1.0, // Totalmente opaco
    color: "#E74C3C", // Mismo color que la comida
  });
}

// Actualiza todos los efectos activos
export function updateEffects() {
  for (let i = activeEffects.length - 1; i >= 0; i--) {
    const effect = activeEffects[i];

    // Actualiza propiedades
    effect.radius += RING_EXPAND_SPEED;
    effect.alpha -= RING_FADE_SPEED;

    // Si el efecto ya es invisible, elimínalo
    if (effect.alpha <= 0) {
      activeEffects.splice(i, 1);
    }
  }
}

// Dibuja todos los efectos activos en el canvas
export function drawEffects(ctx) {
  activeEffects.forEach((effect) => {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(231, 76, 60, ${effect.alpha})`; // Usa el color y la opacidad
    ctx.lineWidth = RING_INITIAL_WIDTH * effect.alpha; // La línea se hace más delgada al desvanecerse
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.stroke();
  });
}
