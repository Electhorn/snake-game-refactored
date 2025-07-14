// Punto de entrada de la aplicación

import { initGame } from "./src/game.js";
import "/styles.css";

const app = document.querySelector("body");

if (app) {
  initGame();
} else {
  console.error("No se encontró el elemento principal de la aplicación.");
}
