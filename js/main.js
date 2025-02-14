import { GameGUI } from "./GameGUI.js";

const main = document.querySelector("main");


const gameGUI = new GameGUI(main);

const xSelection = document.getElementById("x");
const oSelection = document.getElementById("o");
const startButton = document.getElementById("start-button");



const startGame = (e) => {
    gameGUI.restart();
    const xPlayerType = xSelection.value;
    const oPlayerType = oSelection.value;

    if(xPlayerType == "computer" && oPlayerType == "computer") {
        alert("Both players can't be computers!");
        return;
    }
    gameGUI.setPlayers(xPlayerType, oPlayerType);
}

startButton.addEventListener("click", startGame);





