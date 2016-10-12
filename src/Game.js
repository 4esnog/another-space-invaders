import { throttle } from 'lodash';
import Player from './Player';
import EnemiesGroup from './EnemiesGroup';
import { getRandomInt } from './helpers';
const BGCOLOR = '#1C191E';

// TODO:
// Customize menu screens:
//  - input username before first game
//  - records table
//
// Records table:
//  - maybe heroku or firebase back-end?

class Game {
    constructor (canvas, menu, score) {
        this.started = false;
        this.menu = menu;
        this.canvas = canvas;
        this.score = score;
        this.ctx = canvas.getContext('2d');
        this.resize = throttle(this.resize, 500).bind(this);
        this.initGame = this.initGame.bind(this);

        this.initGame();
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

    changeEnemiesDirection (group) {
        if (this.state.moveEnemies === 'bottom') {
            if (this.state.prevDirection === 'left') {
                this.state.moveEnemies = 'right';
            } else {
                this.state.moveEnemies = 'left';
            }

            this.state.prevDirection = 'bottom';
        } else {
            this.state.prevDirection = this.state.moveEnemies;
            this.state.moveEnemies = 'bottom';
            group.moveBottomWall(group.enemySize);
        }
    }

    initGame () {
        // Draw initial state
        this.resize();
        this.clearCanvas();

        this.score.wipe();

        this.state = {
            movePlayer: false,
            moveEnemies: 'right',
            level: 1,
        };

        this.bullets = [];

        this.enemies = new EnemiesGroup(this.ctx, this.sizes);
        this.enemies.paint();

        this.player = new Player(this.ctx, this.sizes);
        const playerPosition = {
            top: Math.round(this.sizes.height - this.sizes.height * 0.1),
            left: Math.round((this.sizes.width / 2) - (this.player.state.width / 2)),
        };
        this.player.paint(playerPosition.left, playerPosition.top);
    }

    increaseLevel () {
        this.state.level++;
        const speed = this.enemies.state.speed + 2;
        this.player.state.speed += 2;
        this.state.moveEnemies = 'right';
        this.enemies = new EnemiesGroup(this.ctx, this.sizes, speed);
        this.enemies.paint();
        this.start();
    }

    /**
     * start - запустить game loop
     */
    start () {
        let lastTime, timeDiff;
        this.menu.hide();
        if (this.terminated) {
            this.terminated = false;
            this.initGame();
        };
        this.started = true;
        let frame = window.requestAnimationFrame(function drawFrame (time) {
            if (!this.started) {
                window.cancelAnimationFrame(frame);
            } else {
                timeDiff = time - lastTime || 0;
                lastTime = time;
                this.clearCanvas();

                const invasionSucceed = this.isElementInside(
                    this.enemies.state,
                    {
                        ...this.player.state,
                        x: 0,
                        width: this.sizes.width,
                    }
                );

                if (invasionSucceed) {
                    this.gameOver();
                }

                this.bullets = this.bullets.filter(bullet => {
                    const { width, height, x, y } = bullet.state;
                    let bulletStatus = this.isElementVisible(width, height, x, y);
                    if (!bulletStatus || !bullet) return false;

                    if (this.isElementInside(this.player.state, bullet.state)) {
                        this.gameOver();
                    }

                    this.enemies.enemies = this.enemies.enemies.filter(enemy => {
                        if (!bullet) return true;
                        if (this.isElementInside(enemy.state, bullet.state)) {
                            this.score.update(enemy.getPoints(this.state.level));
                            enemy = null;
                            bullet = null;
                            bulletStatus = false;
                            return false;
                        } else {
                            return true;
                        }
                    });

                    if (bulletStatus) {
                        bullet.move(bullet.direction, timeDiff);
                    } else {
                        bullet = null;
                    }

                    return bulletStatus;
                });

                if (this.enemies.enemies.length === 0) {
                    this.increaseLevel();
                    return;
                }

                if (getRandomInt(0, 3000) > 2970) {
                    this.enemies.fire(this.bullets);
                }
                const canMoveEnemies = this.enemies.move(this.state.moveEnemies, timeDiff);
                if (!canMoveEnemies) {
                    this.changeEnemiesDirection(this.enemies);
                }

                if (this.state.movePlayer) {
                    this.player.move(this.state.movePlayer, timeDiff);
                } else {
                    this.player.paint();
                }

                frame = window.requestAnimationFrame(drawFrame.bind(this));
            }
        }.bind(this));
    }

    /**
     * pause - приостановить game loop
     */
    pause () {
        this.started = false;
        this.menu.pause(this.score.getScore());
    }

    gameOver () {
        this.terminated = true;
        this.started = false;
        this.menu.gameOver(this.score.getScore());
    }

    handleEnter (event) {
        this.started ? this.pause() : this.start();
    }

    handleSpace (event) {
        if (!this.started) return;
        this.player.fire(this.bullets);
    }

    handleArrowLeft (event) {
        if (!this.started || this.state.movePlayer === 'right') return;

        if (event.type === 'keydown' || event.type === 'pointerdown') {
            this.state.movePlayer = 'left';
        } else {
            this.state.movePlayer = false;
        }
    }

    handleArrowRight (event) {
        if (!this.started || this.state.movePlayer === 'left') return;

        if (event.type === 'keydown' || event.type === 'pointerdown') {
            this.state.movePlayer = 'right';
        } else {
            this.state.movePlayer = false;
        }
    }
}

export default Game;
