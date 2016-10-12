class GameElement {
    constructor (ctx, gameSizes, width = 30, height = 30, speed = 20, x, y, color = '#EFE6DD') {
        this.ctx = ctx;
        this.gameSizes = gameSizes;
        this.color = color;
        this.state = {
            width,
            height,
            speed,
            x,
            y,
        };
    }

    paint (
        x = this.state.x,
        y = this.state.y,
        width = this.state.width,
        height = this.state.height,
    ) {
        this.state.x = x;
        this.state.y = y;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(x, y, width, height);
    }

    setNewPosition (dirX, dirY, speed, time) {
        const dx = dirX * (speed * this.gameSizes.wUnit) * (time / 1000);
        const dy = dirY * (speed * this.gameSizes.hUnit) * (time / 1000);
        const newX = Math.round(this.state.x + dx);
        const newY = Math.round(this.state.y + dy);

        this.paint(newX, newY);
        return {
            dx: Math.round(dx),
            dy: Math.round(dy),
        };
    }

    move (direction, time = 1, speed = this.state.speed) {
        switch (direction) {
            case 'right': {
                this.moveDiff = this.setNewPosition(1, 0, speed, time);
                return this.moveDiff;
            }

            case 'left': {
                this.moveDiff = this.setNewPosition(-1, 0, speed, time);
                return this.moveDiff;
            }

            case 'top': {
                this.moveDiff = this.setNewPosition(0, -1, speed, time);
                return this.moveDiff;
            }

            case 'bottom': {
                this.moveDiff = this.setNewPosition(0, 1, speed, time);
                return this.moveDiff;
            }

            default: {
                this.paint();
            }
        }
    }
}

export default GameElement;
