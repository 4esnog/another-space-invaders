import { throttle } from 'lodash';
import GameElement from './GameElement';
import Bullet from './Bullet';

const PLAYER_COLOR = '#299EAD';
let instance;

class Player extends GameElement {
    constructor (ctx, gameSizes, ...args) {
        super(ctx, gameSizes, ...args);

        this.fire = throttle(this.fire, 200).bind(this);
        this.state = {
            ...this.state,
            width: this.gameSizes.wUnit * 5,
        };

        this.color = PLAYER_COLOR;
        this.leftWall = gameSizes.wUnit * 15;
        this.rightWall = gameSizes.width - gameSizes.wUnit * 15;

        // Singletone
        if (!instance) instance = this;
        return instance;
    }

    fire (bullets) {
        const x = Math.round(this.state.x + (this.state.width / 2));
        const y = Math.round(this.state.y - (this.state.height / 2));

        const bullet = new Bullet(
            'player',
            this.ctx,
            this.gameSizes,
            x,
            y,
            60,
            '#00C4E2',
        );

        bullets.push(bullet);
        bullet.paint();
        return bullet;
    }

    move (direction, time, speed) {
        if (this.reachedWall(direction) === direction) {
            this.paint();
            return false;
        }

        super.move(direction, time, speed);
    }

    reachedWall (direction) {
        const { x, width } = this.state;

        if (x + width >= this.rightWall && direction === 'right') {
            return 'right';
        } else if (x <= this.leftWall && direction === 'left') {
            return 'left';
        } else {
            return false;
        }
    }
}

export default Player;
