import GameElement from './GameElement';
import Enemy from './Enemy';

class EnemiesGroup extends GameElement {
    constructor (ctx, gameSizes) {
        super(ctx, gameSizes);

        const speed = 7;
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

        this.state = {
            ...this.state,
            x: groupX,
            y: groupY,
            speed,
        };
    }

    paint () {
        this.enemies.map(enemy => {
            enemy.paint();
        });
    }

    move (direction, time = 0, speed = this.state.speed) {
        this.enemies.map(enemy => {
            enemy.move(direction, time);
        });
    }
}

export default EnemiesGroup;
