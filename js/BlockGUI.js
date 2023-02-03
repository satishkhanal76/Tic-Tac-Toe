export class BlockGUI {

    #col;
    #row;

    #element;

    constructor(col, row) {
        this.#col = col;
        this.#row = row;


        this.#createBlock();
    }


    #createBlock(col, row) {
        this.#element = document.createElement("div");
        this.#element.classList.add("block");

    }

    mark(item) {
        this.#element.textContent = item.getCharacter();
    }

    getElement() {
        return this.#element;
    }

    getColumn() {
        return this.#col;
    }

    getRow() {
        return this.#row;
    }

    unmark() {
        this.#element.textContent = "";
    }

}