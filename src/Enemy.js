import GameElement from './GameElement';

class Enemy extends GameElement {
    constructor (type, ...args) {
        super(...args);
        this.type = type;
    }

    getPoints (level) {
        return this.type * level * 100;
    }
}

export default Enemy;
