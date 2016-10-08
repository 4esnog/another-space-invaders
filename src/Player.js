import { throttle } from 'lodash';
import GameElement from './GameElement';
import Bullet from './Bullet';

let instance;

class Player extends GameElement {
    constructor (...args) {
        super(...args);

        this.fire = throttle(this.fire, 200).bind(this);
        this.state = {
            ...this.state,
            width: this.gameSizes.wUnit * 5,
        };

        // Singletone
        if (!instance) instance = this;
        return instance;
    }

    fire () {
        const x = Math.round(this.state.x + (this.state.width / 2));
        const y = Math.round(this.state.y - (this.state.height / 2));

        const bullet = new Bullet(
            this,
            this.ctx,
            this.gameSizes,
            x,
            y,
        );
        console.log('fire!');

        bullet.paint();
        return bullet;
    }
}

export default Player;
