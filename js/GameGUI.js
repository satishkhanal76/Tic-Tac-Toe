import { Game } from "./Game.js";
import { BlockGUI } from "./BlockGUI.js";

export class GameGUI {

    #mainElement;

    #game;
    #element;

    #blocks = [];

    constructor(main) {
        this.#mainElement = main;

        
        this.#game = new Game();


        
        this.setUpMainElement();
        
        this.createBoard();
        this.createBlocks();
        this.addBlockEvents();

        this.addEvents();
    }

    addEvents() {
        document.body.addEventListener("keydown", (eve) => this.handleKeydown(eve));

    }

    setUpMainElement() {
        this.#mainElement.style.setProperty('--num-of-cols', this.#game.getBoard().getNumOfColumns());
        this.#mainElement.style.setProperty('--num-of-rows', this.#game.getBoard().getNumOfColumns());
        this.#mainElement.style.setProperty('--board-width', this.#game.getBoard().getNumOfColumns() * 100 + "px");
        this.#mainElement.style.setProperty('--board-height', this.#game.getBoard().getNumOfRows() * 100 + "px");
    }

    handleKeydown(eve) {
        if(eve.key == " " && this.#game.isOver()) {
            this.#game.restart();
            for (let i = 0; i < this.#blocks.length; i++) {
                const element = this.#blocks[i];
                element.unmark();
            }
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
        for (let i = 0; i < this.#game.getBoard().getNumOfColumns(); i++) {
            for (let j = 0; j < this.#game.getBoard().getNumOfRows(); j++) {
                block = new BlockGUI(i, j);
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
        console.log(winnerObj["winner"].getCharacter(), " won the game!");
    }

    handleGameTie() {
        console.log("It's a tie!");
    }
}