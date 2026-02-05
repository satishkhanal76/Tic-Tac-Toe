import { GameGUI } from "./GameGUI.js";

const main = document.querySelector("main");


const gameGUI = new GameGUI(main);
gameGUI.handle404();

function getProjectBasePath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  return `/${parts[0]}/`;
}

document.getElementById("reset-button")?.addEventListener("click", () => {
  window.location.href = getProjectBasePath();
});