import GameElement from './GameElement';
import Enemy from './Enemy';

class EnemiesGroup extends GameElement {
    constructor (ctx, gameSizes) {
        super(ctx, gameSizes);

        const speed = 20;
        const groupX = gameSizes.wUnit * 25;
        const groupY = gameSizes.hUnit * 10;
        const groupWidth = gameSizes.width - groupX * 2;
        const enemySize = Math.round(groupWidth / 23);

        this.enemies = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 12; j++) {
                let x = groupX + j * 2 * enemySize;
                let y = groupY + i * 2 * enemySize;
                this.enemies.push(
                    new Enemy(ctx, gameSizes, enemySize, enemySize, speed, x, y)
                );
            }
        }
    }

    paintAll () {
        this.enemies.map(el => {
            el.paint();
        });
    }

    moveAll (direction, time = 0, speed = this.state.speed) {
        this.enemies.map(el => {
            el.move(direction, time, speed);
        });
    }
}

export default EnemiesGroup;
