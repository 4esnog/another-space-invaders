import { throttle } from 'lodash';
import GameElement from './GameElement';
// import Bullet from './Bullet';

class Player extends GameElement {
    constructor (ctx, gameSizes, width, height, speed) {
        super(ctx, gameSizes, width, height, speed);

        this.fire = throttle(this.fire, 200).bind(this);
    }

    fire () {
        // const bullet = new Bullet('player');
    }
}

export default Player;
