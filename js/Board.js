import { Item } from "./Item.js";


export class Board {

    #NUM_OF_COLUMNS = 3;
    #NUM_OF_ROWS = 3;

    #board;

    constructor({col, row} = {}) {

        if(col && !isNaN(col)) this.#NUM_OF_COLUMNS = col;
        if(row && !isNaN(row)) this.#NUM_OF_ROWS = row;

        this.#createBoard();
    }

    #createBoard() {
        this.#board = new Array(this.#NUM_OF_ROWS);

        for (let i = 0; i < this.#board.length; i++) {
            this.#board[i] = new Array(this.#NUM_OF_COLUMNS);
        }
    }
    /**
     * Places an item to the board
     * @param {Item} item the item to insert into the board
     * @param {int} col the column to insert the item into
     * @param {int} row the row to insert the item into
     * @returns the item if the insertion is successfull else null
     */
    placeItem(item, col, row) {
        if(!(item instanceof Item)) return null;

        if(col >= this.#NUM_OF_COLUMNS) return null;
        if(row >= this.#NUM_OF_ROWS) return null;

        if(this.#board[row][col]) {
            console.error(`Insertion failed! Item already exists in the board at [${row}][${col}].`);
            return;
        };
        this.#board[row][col] = item;
        return item;
    }

    /**
     * Checks a vertical line on the tic tac toe board
     * @param {int} colNum the column number to check
     * @returns item if the same item is found on a vertical line
     */
    verticalCheck(colNum) {
        let item, nextItem;

        for (let i = 0; i < this.#NUM_OF_ROWS - 1; i++) {
            item = this.#board[i][colNum];
            nextItem = this.#board[i + 1][colNum];
            if(item != nextItem) {
                return null;
            }
            
        }
        return item;
    }

    /**
     * Checks a horizontal line on the tic tac toe board
     * @param {int} rowNum the row number to check
     * @returns item if the same item is found ont a horizontal line
     */
    horizontalCheck(rowNum) {
        let item, nextItem;

        for (let i = 0; i < this.#NUM_OF_COLUMNS - 1; i++) {
            item = this.#board[rowNum][i];
            nextItem = this.#board[rowNum][i + 1];

            if(item != nextItem) {
                return null;
            }
            
        }
        return item;
    }

    /**
     * Checks the diagnol line through the middle on the tic tac toe board
     * @returns item if the same item is found on a diagnol line through the middle
     */

    diagonalCheck() {
        if(this.#NUM_OF_COLUMNS != this.#NUM_OF_ROWS) {
            console.error("Cannot do a diagonal check when the columns and rows are not equal!");
            return null;
        }
        let item, nextItem;
        
        for (let i = 0; i < this.#NUM_OF_COLUMNS - 1; i++) {
            item = this.#board[i][i];
            nextItem = this.#board[i + 1][i  + 1];

            if(item != nextItem) {
                return null;
            }
        }
        return item;
    }

    /**
     * Checks the diagnol line through the middle on the tic tac toe board from TR to BL
     * @returns item if the same item is found on a diagnol line through the middle
     */

    otherDiagonalCheck() {
        if(this.#NUM_OF_COLUMNS != this.#NUM_OF_ROWS) {
            console.error("Cannot do a diagonal check when the columns and rows are not equal!");
            return null;
        }
        let item, nextItem;
        
        let j = 0, k = 0;

        for (let i = 0; i < this.#NUM_OF_COLUMNS - 1; i++) {
            j = i;
            k = Math.abs(i - (this.#NUM_OF_COLUMNS - 1));

            item = this.#board[k][j];
            nextItem = this.#board[Math.abs((j + 1) - (this.#NUM_OF_COLUMNS - 1))][j + 1];
            
            if(item != nextItem) {
                return null;
            }

        }
        return item;
    }

    /**
     * Clears the board
     */
    clear() {
        this.#createBoard();
    }

    checkForWinner() {
        let winner = null;

        for (let i = 0; i < this.#NUM_OF_ROWS; i++) {
            winner = this.horizontalCheck(i);
            if(winner) return {
                type: "HORIZONTAL_WIN",
                winner,
                rowNum: i
            };
        }

        for (let i = 0; i < this.#NUM_OF_COLUMNS; i++) {
            winner = this.verticalCheck(i);
            if(winner) return {
                type: "VERTICAL_WIN",
                winner,
                colNum: i
            };
        }

        winner = this.diagonalCheck();
        if(winner) return {
            type: "DIAGNOL_WIN",
            winner
        };

        winner = this.otherDiagonalCheck();
        if(winner) return {
            type: "X_DIAGNOL_WIN",
            winner
        };

        return null;
    }

    isSpaceAvailable() {
        for (let i = 0; i < this.#NUM_OF_COLUMNS; i++) {
            for (let j = 0; j < this.#NUM_OF_ROWS; j++) {
                if(!this.#board[j][i]) return true;
            }
        }
        return false;
    }

    logBoard() {
        let string = "";
        for (let i = 0; i < this.#board.length; i++) {
            for (let j = 0; j < this.#board[i].length; j++) {
                if(this.#board[j][i]){
                    string += this.#board[j][i].getCharacter();
                }else {
                    string += " ";
                }
            }
            string += "\n";
        }
        console.log(string);
    }

    getNumOfColumns() {
        return this.#NUM_OF_COLUMNS;
    }

    getNumOfRows() {
        return this.#NUM_OF_ROWS;
    }

}