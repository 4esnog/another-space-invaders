import GameElement from './GameElement';

class Bullet extends GameElement {
    constructor (owner, ctx, gameSizes, x, y, speed = 50) {
        super(ctx, gameSizes);

        this.direction = (owner === 'player')
            ? 'top'
            : 'bottom';

        const width = this.gameSizes.hUnit;
        const height = this.gameSizes.wUnit * 2;
        x -= (width / 2);
        y = (this.direction === 'top')
            ? y - height
            : y + height;

        this.state = {
            ...this.state,
            width,
            height,
            speed,
            x,
            y,
        };
    }
}

export default Bullet;
