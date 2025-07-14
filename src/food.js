// Módulo para la entidad Comida.

import {
  FOOD_ANIMATION_SPEED,
  FOOD_MAX_SCALE,
  FOOD_MIN_SCALE,
} from "./config.js";

let foodX, foodY;
let foodScale = 1.0;
let foodAnimationDirection = 1;

export function generateFood(box, snakeBody, gridWidth, gridHeight) {
  let foodOnSnake;
  do {
    foodOnSnake = false;
    // Usamos los nuevos parámetros para generar la comida
    const foodGridX = Math.floor(Math.random() * gridWidth);
    const foodGridY = Math.floor(Math.random() * gridHeight);
    foodX = foodGridX * box;
    foodY = foodGridY * box;

    for (const segment of snakeBody) {
      if (segment.x === foodX && segment.y === foodY) {
        foodOnSnake = true;
        break;
      }
    }
  } while (foodOnSnake);

  foodScale = 1.0;
  foodAnimationDirection = 1;
}

export function updateFood() {
  foodScale += foodAnimationDirection * FOOD_ANIMATION_SPEED;
  if (foodScale > FOOD_MAX_SCALE || foodScale < FOOD_MIN_SCALE) {
    foodAnimationDirection *= -1;
    foodScale = Math.max(FOOD_MIN_SCALE, Math.min(foodScale, FOOD_MAX_SCALE));
  }
}

export function drawFood(ctx, box) {
  const scaledBox = box * foodScale;
  const offsetX = (box - scaledBox) / 2;
  const offsetY = (box - scaledBox) / 2;
  // Nuevo color para la comida: un rojo vibrante
  ctx.fillStyle = "#E74C3C";
  ctx.fillRect(foodX + offsetX, foodY + offsetY, scaledBox, scaledBox);
}

export function getFoodPosition() {
  return { x: foodX, y: foodY };
}
