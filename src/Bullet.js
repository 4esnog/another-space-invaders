import GameElement from './GameElement';

class Bullet extends GameElement {
    constructor (owner, ctx, gameSizes, x, y, speed = 40) {
        super(ctx, gameSizes);

        const width = this.gameSizes.hUnit;
        const height = this.gameSizes.wUnit * 2;
        x -= (width / 2);
        y -= height;

        this.state = {
            ...this.state,
            width,
            height,
            speed,
            x,
            y,
        };

        this.direction = (owner === 'player')
            ? 'top'
            : 'bottom';
    }
}

export default Bullet;
