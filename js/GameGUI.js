import { Game } from "./Game.js";
import { BlockGUI } from "./BlockGUI.js";

export class GameGUI {

    #mainElement;

    #game;
    #element;

    #winLine;

    #blocks = [];

    constructor(main) {
        this.#mainElement = main;

        
        this.#game = new Game();


        
        
        this.createBoard();
        this.createBlocks();
        this.addBlockEvents();
        
        this.setUpMainElement();

        this.addEvents();
    }

    addEvents() {
        document.body.addEventListener("keydown", (eve) => this.handleKeydown(eve));

    }

    setUpMainElement() {
        this.#element.style.setProperty('--num-of-cols', this.#game.getBoard().getNumOfColumns());
        this.#element.style.setProperty('--num-of-rows', this.#game.getBoard().getNumOfColumns());
    }

    handleKeydown(eve) {
        if(eve.key == " " && this.#game.isOver()) {
            this.#game.restart();
            for (let i = 0; i < this.#blocks.length; i++) {
                const element = this.#blocks[i];
                element.unmark();
            }
            this.removeWinLine();
        }
    }

    addBlockEvents() {
        for (let i = 0; i < this.#blocks.length; i++) {
            const element = this.#blocks[i];
            element.getElement().addEventListener("click", () => this.clicked(element));
        }
    }

    createBoard() {
        this.#element = document.createElement("div");
        this.#element.classList.add("board");
        this.#mainElement.appendChild(this.#element);
    }

    createBlocks() {
        let block;
        for (let i = 0; i < this.#game.getBoard().getNumOfRows(); i++) {
            for (let j = 0; j < this.#game.getBoard().getNumOfColumns(); j++) {
                block = new BlockGUI(j, i);
                this.#element.appendChild(block.getElement());
                this.#blocks.push(block);
            }
        }
    }


    clicked(block) {
        if(this.#game.isOver()) return;

        let item = this.#game.placeItem(block.getColumn(), block.getRow());

        if(item) block.mark(item);

        //check if the game is over
        if(this.#game.isOver() && this.#game.getWinner()) {
            this.handleGameWin(this.#game.getWinnerObj());
        } else if(this.#game.isOver()) {
            this.handleGameTie();
        }
    }


    handleGameWin(winnerObj) {

        this.addWinLine(winnerObj);


        console.log(winnerObj["winner"].getCharacter(), " won the game!");
    }

    addWinLine(winnerObj) {
        this.#winLine = document.createElement("div");
        this.#winLine.classList.add("line-container");
        let line = document.createElement("div");
        line.classList.add("line");


        let topOffset, leftOffset = 0, rotation = 0;
        let width = this.#element.offsetWidth;
        let height = this.#element.offsetHeight;

        switch (winnerObj.type) {
            case "HORIZONTAL_WIN":
                topOffset = height / this.#game.getBoard().getNumOfRows() * winnerObj.rowNum + 50;
                break;

            case "VERTICAL_WIN":
                rotation = 90;
                topOffset = height / 2;
                leftOffset = -(height / 2);
                leftOffset += height / this.#game.getBoard().getNumOfColumns() * winnerObj.colNum + 50;
                this.#winLine.style.width = height + "px";
                break;

            case "DIAGNOL_WIN":
                rotation = 45;
                topOffset = width / 2;
                break;

            case 'X_DIAGNOL_WIN':
                rotation = 135;
                topOffset = width / 2;
                break;
            default:
                break;
        }


        this.#element.style.setProperty('--top-offset', topOffset + "px");
        this.#element.style.setProperty('--left-offset', leftOffset + "px");
        this.#element.style.setProperty('--rotation', rotation + "deg");

        this.#winLine.appendChild(line);
        this.#element.appendChild(this.#winLine);
    }

    removeWinLine() {
        if(this.#winLine) this.#winLine.remove();
    }

    handleGameTie() {
        console.log("It's a tie!");
    }
}