import { throttle } from 'lodash';
const BGCOLOR = '#1C191E';

class Game {
    constructor (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize = throttle(this.resize, 500).bind(this);

        this.resize();
        this.ctx.fillStyle = BGCOLOR;
        this.ctx.fillRect(0, 0, this.sizes.width, this.sizes.height);
    }

    resize () {
        const canvas = this.canvas;
        const styles = window.getComputedStyle(canvas);

        this.setSizes(styles);
        canvas.width = parseInt(styles.width);
        canvas.height = parseInt(styles.height);

        this.ctx.fillStyle = BGCOLOR;
        this.ctx.fillRect(0, 0, this.sizes.width, this.sizes.height);
    }

    setSizes (styles) {
        this.sizes = {
            height: parseInt(styles.height),
            width: parseInt(styles.width)
        };
    }

    start () {
        let frame = window.requestAnimationFrame(function ABC (time) {
            console.log(time);
            // frame = window.requestAnimationFrame(ABC);
        });
    }
}

export default Game;
