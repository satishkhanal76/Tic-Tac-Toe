import { Game } from "./Game.js";
import { BlockGUI } from "./BlockGUI.js";

export class GameGUI {

    #mainElement;

    #game;
    #element;

    #winLine;

    #blocks = [];

    #ai;

    constructor(main) {
        this.#mainElement = main;

        
        this.#game = new Game();
        
        
        this.createBoard();
        this.createBlocks();
        this.addBlockEvents();
        
        this.setUpMainElement();

        this.addEvents();

        this.startGame();
        
    }

    startGame() {
        this.doAiMove();
    }

    doAiMove() {
        if(!this.#ai) return;
        if(this.#game.getCurrentTurn() != this.#ai) return;
        
        let bestBlock = this.minimax();

        if(!bestBlock) return;

        bestBlock = this.#blocks.filter(block => (block.getColumn() == bestBlock.col && block.getRow() == bestBlock.row));
        bestBlock = bestBlock.shift();
        this.clicked(bestBlock);
    }

    minimax() {
        let bestValue = -Infinity;
        let bestMove;

        let availableBlocks = this.#game.getBoard().getAvailableSpaces();
        
        let maximizingPlayer = this.#game.getCurrentTurn();

        availableBlocks.forEach(block => {
            this.#game.placeItem(block.col, block.row);

            let value = Math.max(bestValue, this.#game.minimax(maximizingPlayer));
            
            if (value > bestValue) {
                bestValue = value;
                bestMove = block;
            }

            this.#game.unplaceItem(block.col, block.row);
        });

        return bestMove;

    }

    addEvents() {
        document.body.addEventListener("keydown", (eve) => this.handleKeydown(eve));
        document.body.addEventListener("dblclick", eve => this.handleDoubleClick(eve));
    }

    setUpMainElement() {
        this.#element.style.setProperty('--num-of-cols', this.#game.getBoard().getNumOfColumns());
        this.#element.style.setProperty('--num-of-rows', this.#game.getBoard().getNumOfColumns());
    }

    handleKeydown(eve) {
        if(eve.key == " ") {
            this.reset(); 
        } else if(eve.key == "a") {
            this.envokeAi();
        }
    }
    handleDoubleClick(eve) {
        this.envokeAi();
    }
    envokeAi() {
        if(this.#ai) return;
        this.#ai = this.#game.getCurrentTurn();
        this.doAiMove();
    }

    reset() {
        if(!this.#game.isOver()) return null;
        this.#game.restart();

        this.unmarkBlocks();
        this.removeWinLine();
        
        this.startGame();
        return true;
    }

    unmarkBlocks() {
        for (let i = 0; i < this.#blocks.length; i++) {
            const element = this.#blocks[i];
            element.unmark();
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
        this.doAiMove();
    }


    handleGameWin(winnerObj) {
        this.addWinLine(winnerObj);
        this.showModal(`${winnerObj["winner"].getCharacter()} wins!`);
        
    }

    showModal(text) {
        let modalContainer = document.getElementById("modal-container");

        document.getElementById("modal-title").textContent = text;
        document.getElementById("close-button").addEventListener("click", () => modalContainer.style.display = "none");
        document.getElementById("reset-button").addEventListener("click", () => {
            if(this.reset()) {
                modalContainer.style.display = "none";
            }
        });
        
        modalContainer.style.display = "flex";
    }

    handleGameTie() {
        this.showModal(`It's a tie!`);
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
}