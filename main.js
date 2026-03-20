import { startGame } from "./js/game.js";

console.log("MAIN.JS LOADED");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 500;

startGame(canvas, ctx);