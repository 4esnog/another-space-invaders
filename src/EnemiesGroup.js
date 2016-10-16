import GameElement from './GameElement';
import Enemy from './Enemy';
import Bullet from './Bullet';
import { getRandomInt } from './helpers';

class EnemiesGroup extends GameElement {
    constructor (ctx, gameSizes, speed = 6) {
        super(ctx, gameSizes);

        const groupY = gameSizes.hUnit * 10;
        const groupHeight = gameSizes.hUnit * 50 - groupY;
        const enemySize = Math.round(groupHeight / 9);
        const groupWidth = enemySize * 23;
        const groupX = (gameSizes.width - groupWidth) / 2;

        this.enemies = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 12; j++) {
                let x = groupX + j * 2 * enemySize;
                let y = groupY + i * 2 * enemySize;
                this.enemies.push(
                    new Enemy(5 - i, ctx, gameSizes, enemySize, enemySize, speed, x, y, '#DB3B43')
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
        this.leftWall = gameSizes.wUnit * 15;
        this.rightWall = gameSizes.width - gameSizes.wUnit * 15;
        this.bottomWall = groupY + groupHeight + enemySize;
    }

    paint () {
        this.enemies.map(enemy => {
            enemy.paint();
        });
    }

    move (direction, time = 0, speed = this.state.speed) {
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

    fire (bullets, sound, color) {
        let { x, y, right, bottom } = this.state;
        x = getRandomInt(x, right);
        y = bottom;

        const bullet = new Bullet(
            'enemy',
            this.ctx,
            this.gameSizes,
            x,
            y,
            this.state.speed * 3,
            color,
        );

        bullets.push(bullet);
        bullet.paint();

        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }

        return bullet;
    }

    setDimensions (enemies, direction) {
        let xs = enemies.map(enemy => enemy.state.x);
        let ys = enemies.map(enemy => enemy.state.y);
        const x = Math.min(...xs);
        const y = Math.min(...ys);
        const right = Math.max(...xs) + enemies[0].state.width;
        const bottom = Math.max(...ys) + enemies[0].state.height;
        const width = right - x;
        const height = bottom - y;

        this.state = { ...this.state, x, y, right, bottom, width, height };
    }

    moveBottomWall (diff) {
        this.bottomWall = this.state.y + this.state.height + diff;
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
