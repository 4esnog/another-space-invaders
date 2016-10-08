import { throttle } from 'lodash';
import Player from './Player';
const BGCOLOR = '#1C191E';

class Game {
    constructor (canvas, menu) {
        this.started = false;
        this.menu = menu;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize = throttle(this.resize, 500).bind(this);
        this.state = {
            move: {
                right: false,
                left: false,
            },
        };
        this.bullets = [];

        // Draw initial state
        this.resize();
        this.ctx.fillStyle = BGCOLOR;
        this.ctx.fillRect(0, 0, this.sizes.width, this.sizes.height);

        this.player = new Player(this.ctx, this.sizes);
        const playerPosition = {
            top: Math.round(this.sizes.height - this.sizes.height * 0.1),
            left: Math.round((this.sizes.width / 2) - (this.player.state.width / 2)),
        };
        this.player.paint(playerPosition.left, playerPosition.top);
    }

    /**
     * resize - перерисовать игру при ресайзе окна браузера
     */
    resize () {
        const canvas = this.canvas;
        const styles = window.getComputedStyle(canvas);

        this.setSizes(styles);
        canvas.width = parseInt(styles.width);
        canvas.height = parseInt(styles.height);

        this.clearCanvas();
    }

    clearCanvas () {
        this.ctx.fillStyle = BGCOLOR;
        this.ctx.fillRect(0, 0, this.sizes.width, this.sizes.height);
    }

    isElementVisible (width, height, x, y) {
        if (
            (x + width) < 0 ||
            x > this.sizes.width ||
            (y + height) < 0 ||
            y > this.sizes.height
        ) {
            return false;
        } else {
            return true;
        }
    }

    setSizes (styles) {
        this.sizes = {
            height: parseInt(styles.height),
            width: parseInt(styles.width),
            hUnit: Math.floor(parseInt(styles.height) / 100),
            wUnit: Math.floor(parseInt(styles.width) / 100),
        };
    }

    /**
     * start - запустить game loop
     */
    start () {
        let lastTime, timeDiff;
        this.menu.hide();
        this.started = true;
        let frame = window.requestAnimationFrame(function drawFrame (time) {
            if (!this.started) {
                window.cancelAnimationFrame(frame);
            } else {
                timeDiff = time - lastTime;
                lastTime = time;
                this.clearCanvas();

                this.bullets = this.bullets.filter((bullet) => {
                    const { width, height, x, y } = bullet.state;

                    if (this.isElementVisible(width, height, x, y)) {
                        bullet.move(bullet.direction, timeDiff);
                        return true;
                    } else {
                        bullet = null;
                        return false;
                    }
                });

                for (let key in this.state.move) {
                    if (this.state.move[key]) {
                        this.player.move(key, timeDiff);
                    } else {
                        this.player.paint();
                    }
                }

                frame = window.requestAnimationFrame(drawFrame.bind(this));
            }
        }.bind(this));
    }

    /**
     * pause - приостановить game loop
     */
    pause () {
        this.menu.show();
        this.started = false;
    }

    handleEnterEscape (event) {
        this.started ? this.pause() : this.start();
    }

    handleSpace (event) {
        if (!this.started) return;
        const newBullet = this.player.fire();
        this.bullets.push(newBullet);
    }

    handleArrowLeft (event) {
        if (!this.started || this.state.move.right) return;

        if (event.type === 'keydown') {
            this.state.move.left = true;
        } else {
            this.state.move.left = false;
        }
    }

    handleArrowRight (event) {
        if (!this.started || this.state.move.left) return;

        if (event.type === 'keydown') {
            this.state.move.right = true;
        } else {
            this.state.move.right = false;
        }
    }
}

export default Game;
