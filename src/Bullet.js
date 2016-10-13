import GameElement from './GameElement';
const BULLET_COLOR = '#FC440F';

class Bullet extends GameElement {
    constructor (owner, ctx, gameSizes, x, y, speed = 60, color = BULLET_COLOR) {
        super(ctx, gameSizes, gameSizes.hUnit, gameSizes.wUnit * 2, speed);

        this.direction = (owner === 'player')
            ? 'top'
            : 'bottom';

        x -= (this.state.width / 2);
        y = (this.direction === 'top')
            ? y - this.state.height
            : y + this.state.height;

        this.color = color;
        this.state = {
            ...this.state,
            x,
            y,
        };
    }
}

export default Bullet;
