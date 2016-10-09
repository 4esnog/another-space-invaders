import { throttle } from 'lodash';
import Player from './Player';
import EnemiesGroup from './EnemiesGroup';
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

        // Draw initial state
        this.resize();
        this.ctx.fillStyle = BGCOLOR;
        this.ctx.fillRect(0, 0, this.sizes.width, this.sizes.height);

        this.bullets = [];
        this.enemies = new EnemiesGroup(this.ctx, this.sizes);
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

    isElementInside (native, outer) {
        if (
            (outer.x + outer.width) < native.x ||
            outer.x > native.x + native.width ||
            (outer.y + outer.height) < native.y ||
            outer.y > native.y + native.height
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

                this.bullets = this.bullets.filter(bullet => {
                    const { width, height, x, y } = bullet.state;
                    let status = this.isElementVisible(width, height, x, y);

                    this.enemies.enemies = this.enemies.enemies.filter(enemy => {
                        if (!bullet) return true;
                        if (this.isElementInside(enemy.state, bullet.state)) {
                            enemy = null;
                            bullet = null;
                            status = false;
                            return false;
                        } else {
                            return true;
                        }
                    });

                    if (status) {
                        bullet.move(bullet.direction, timeDiff);
                    } else {
                        bullet = null;
                    }

                    return status;
                });

                this.enemies.paintAll();

                for (let key in this.state.move) {
                    if (this.state.move[key]) {
                        this.player.move(key, timeDiff);
                    } else {
                        this.player.paint();
                    }
                }
                console.log(this.enemies.enemies);
                console.log(this.bullets);

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

    handleEnter (event) {
        this.started ? this.pause() : this.start();
    }

    handleSpace (event) {
        if (!this.started) return;
        this.player.fire(this.bullets);
    }

    handleArrowLeft (event) {
        if (!this.started || this.state.move.right) return;

        if (event.type === 'keydown' || event.type === 'pointerdown') {
            this.state.move.left = true;
        } else {
            this.state.move.left = false;
        }
    }

    handleArrowRight (event) {
        if (!this.started || this.state.move.left) return;

        if (event.type === 'keydown' || event.type === 'pointerdown') {
            this.state.move.right = true;
        } else {
            this.state.move.right = false;
        }
    }
}

export default Game;
