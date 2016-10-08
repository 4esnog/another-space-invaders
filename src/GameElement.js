class GameElement {
    constructor (ctx, gameSizes, width = 30, height = 30, speed = 20) {
        this.ctx = ctx;
        this.gameSizes = gameSizes;
        this.state = {
            width: this.gameSizes.wUnit * 5,
            height,
            speed,
        };
    }

    paint (
        x = this.state.x,
        y = this.state.y,
        width = this.state.width,
        height = this.state.height
    ) {
        this.state = { ...this.state, x, y };
        this.ctx.fillStyle = '#f1d';
        this.ctx.fillRect(x, y, width, height);
    }

    setNewPosition (dirX, dirY, speed, time) {
        const dx = dirX * (speed * this.gameSizes.wUnit) * (time / 1000);
        const dy = dirY * (speed * this.gameSizes.hUnit) * (time / 1000);
        const newX = Math.floor(this.state.x + dx);
        const newY = Math.floor(this.state.y + dy);

        this.paint(newX, newY);
    }

    move (direction, time = 0, speed = this.state.speed) {
        switch (direction) {
            case 'right': {
                this.setNewPosition(1, 0, speed, time);
                break;
            }

            case 'left': {
                this.setNewPosition(-1, 0, speed, time);
                break;
            }

            case 'top': {
                this.setNewPosition(0, -1, speed, time);
                break;
            }

            case 'bottom': {
                this.setNewPosition(0, 1, speed, time);
                break;
            }
        }
    }
}

export default GameElement;
