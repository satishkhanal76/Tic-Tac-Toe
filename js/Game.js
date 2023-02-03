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

    changeBoard(boardSize) {
        this.#board = new Board({col: boardSize, row: boardSize});
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
        this.#items.push(new Item("O"));
        this.#items.push(new Item("X"));
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
        if(this.#isOver) {
            console.error("Cannot place item, game is already won.");
            return null;
        };

        let item = this.#board.placeItem(this.#currentTurn, col, row);

        this.checkForWinner();
        this.checkForDraw();
        this.changeTurn();
        
        return item;
    }

    checkForDraw() {
        if(!this.#board.isSpaceAvailable()) {
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