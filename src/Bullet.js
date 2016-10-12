import GameElement from './GameElement';

// const BULLET_COLOR = '#D98324';
const BULLET_COLOR = '#FC440F';
class Bullet extends GameElement {
    constructor (owner, ctx, gameSizes, x, y, speed = 60, color = BULLET_COLOR) {
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

        this.color = color;
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
