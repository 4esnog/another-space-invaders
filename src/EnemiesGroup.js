import GameElement from './GameElement';

class EnemiesGroup extends GameElement {
    constructor (ctx, enemies) {
        super(ctx);
        this.enemies = enemies;
    }
}

export default EnemiesGroup;
