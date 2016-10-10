import GameElement from './GameElement';
import Enemy from './Enemy';

class EnemiesGroup extends GameElement {
    constructor (ctx, gameSizes, speed = 6) {
        super(ctx, gameSizes);

        // const speed = 6 ;
        const groupX = gameSizes.wUnit * 25;
        const groupY = gameSizes.hUnit * 10;
        const groupWidth = gameSizes.width - groupX * 2;
        const enemySize = Math.round(groupWidth / 23);
        const groupHeight = enemySize * 9;

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
            width: groupWidth,
            height: groupHeight,
            speed,
        };

        this.enemySize = enemySize;
        this.leftWall = groupX - gameSizes.wUnit * 10;
        this.rightWall = groupX + groupWidth + gameSizes.wUnit * 10;
        this.bottomWall = groupY + groupHeight + enemySize;
    }

    paint () {
        this.enemies.map(enemy => {
            enemy.paint();
        });
    }

    move (direction, time = 0, speed = this.state.speed) {
        // console.log(this.reachedWall(), direction);
        if (this.reachedWall(direction) === direction) {
            this.paint();
            return false;
        }

        this.enemies.map(enemy => {
            enemy.move(direction, time);
        });
        this.setDimensions(this.enemies);

        return true;
    }

    setDimensions (enemies) {
        let x = enemies.map(enemy => enemy.state.x);
        let y = enemies.map(enemy => enemy.state.y);
        this.state = {
            ...this.state,
            x: Math.min(...x),
            y: Math.min(...y),
            right: Math.max(...x) + enemies[0].state.width,
            bottom: Math.max(...y) + enemies[0].state.height,
        };
    }

    moveBottomWall (diff) {
        this.bottomWall += diff;
    }

    reachedWall (direction) {
        if (this.state.right >= this.rightWall && direction === 'right') {
            return 'right';
        } else if (this.state.x <= this.leftWall && direction === 'left') {
            return 'left';
        } else if (this.state.y + this.state.height >= this.bottomWall && direction === 'bottom') {
            return 'bottom';
        } else {
            return false;
        }
    }
}

export default EnemiesGroup;
