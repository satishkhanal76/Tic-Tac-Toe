import { Board } from "./Board.js";
import { Item } from "./Item.js";

export class Game {
    
    #isOver = false;
    #winner = null;

    #items = [];

    #currentTurnIndex = 0;
    #currentTurn = null;

    #board;

    constructor() {
        this.#createItems();
        this.#createBoard();
        
        this.#startGame();
    }

    checkForWinner() {
        let won = this.#board.checkForWinner();
        if(won != null) {
            this.#isOver = true;
            this.#winner = won;
        }
    }

    restart() {
        this.#clearBoard();
        this.#startGame();
    }

    #clearBoard() {
        this.#board.clear();
    }

    #createBoard() {
        this.#board = new Board();
    }

    changeBoard(col, row) {
        this.#board = new Board({col, row});
    }

    #startGame() {
        this.#isOver = false;
        this.#winner = null;

        this.#currentTurnIndex = 0;
        this.#currentTurn = this.#items[this.#currentTurnIndex];
    }

    /**
     * Creates the item
     */
    #createItems() {
        this.#items.push(new Item('X'));
        this.#items.push(new Item('O'));
    }

    minimax(maximizing) {
        if(this.isOver()) {
            if(!this.#winner) return 0; //no winner (draw)
            return (this.getWinner() == maximizing) ? 1 : -1;
            
        }

        let availableBlocks = this.#board.getAvailableSpaces();
        
        let isMaximizing = (this.getCurrentTurn() == maximizing);

        let value = (isMaximizing) ? -Infinity : Infinity;

        availableBlocks.forEach(block => {
            this.placeItem(block.col, block.row);

            if(isMaximizing) {
                value = Math.max(value, this.minimax(maximizing));
            }else {
                value = Math.min(value, this.minimax(maximizing));
            }

            this.unplaceItem(block.col, block.row);
        });

        return value;
    }

    /**
     * Changes the turn of the item
     */
    changeTurn() {
        this.#currentTurnIndex = this.#currentTurnIndex + 1;
        
        if(this.#currentTurnIndex >= this.#items.length) this.#currentTurnIndex = 0;
        this.#currentTurn = this.#items[this.#currentTurnIndex];
    }

    /**
     * Places the item that has the current turn on the board
     * @param {int} col the column to place the item in
     * @param {int} row the row to place the item in
     */
    placeItem(col, row) {
        if(this.#isOver) return null;

        let item = this.#board.placeItem(this.#currentTurn, col, row);

        if(!item) return null;

        this.checkForWinner();
        this.checkForDraw();
        this.changeTurn();
        
        return item;
    }

    unplaceItem(col, row) {
        this.#board.unplaceItem(col, row);

        this.#isOver = false;
        this.#winner = null;

        this.checkForWinner();
        this.checkForDraw();
        this.changeTurn();
    }

    checkForDraw() {
        //if there is a winner already then return
        if(this.#isOver) return null; 

        let availableSpaces = this.#board.getAvailableSpaces();
        if(availableSpaces.length < 1) {
            this.#isOver = true;
            this.#winner = null;
        }
    }

    /**
     * 
     * @returns the item that has the current turn
     */
    getCurrentTurn() {
        return this.#currentTurn;
    }

    getWinner() {
        return (this.#winner) ? this.#winner["winner"] : null;
    }


    isOver() {
        return this.#isOver;
    }

    getBoard() {
        return this.#board;
    }

    getWinType() {
        return this.#winner["type"];
    }

    getWinnerObj() {
        return this.#winner;
    }

}