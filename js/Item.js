export class Item {

    #character;

    constructor(char) {
        if(!char && char == undefined) return;
        this.#character = char;
        
    }

    getCharacter() {
        return this.#character;
    }
}