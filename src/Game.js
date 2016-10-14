import { throttle } from 'lodash';
import Player from './Player';
import EnemiesGroup from './EnemiesGroup';
import { getRandomInt } from './helpers';

const BGCOLOR = '#1C191E';
const PLAYER_COLOR = '#299EAD';
const PLAYER_BULLET_COLOR = '#00C4E2';
const ENEMY_BULLET_COLOR = '#FC440F';

class Game {
    constructor (canvas, menu, score) {
        this.state = {
            started: false,
            terminated: false,
            movePlayer: false,
            enemiesDirection: 'right',
            level: 1,
        };
        this.menu = menu;
        this.score = score;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize = throttle(this.resize, 500).bind(this);
        this.initGame = this.initGame.bind(this);

        this.initGame();
    }

    initGame () {
        this.resize();

        this.score.wipe();

        this.state = {
            ...this.state,
            movePlayer: false,
            enemiesDirection: 'right',
            level: 1,
        };

        this.bullets = [];

        this.enemies = new EnemiesGroup(this.ctx, this.sizes);
        this.enemies.paint();

        this.player = new Player(this.ctx, this.sizes, PLAYER_COLOR);
        const playerPosition = {
            top: Math.round(this.sizes.height - this.sizes.height * 0.1),
            left: Math.round((this.sizes.width / 2) - (this.player.state.width / 2)),
        };
        this.player.paint(playerPosition.left, playerPosition.top);
    }

    resize () {
        const styles = window.getComputedStyle(this.canvas);

        this.canvas.width = parseInt(styles.width);
        this.canvas.height = parseInt(styles.height);
        this.setSizes(styles);
        this.clearCanvas();
        this.resizeElements(this.sizes);
    }

    resizeElements (sizes) {
        const resizeCb = el => {
            el.resize(sizes);
            el.paint();
        };
        if (this.player) this.player.resize(sizes);
        if (this.enemies) this.enemies.enemies.map(resizeCb);
        if (this.bullets) this.bullets.map(resizeCb);
    }

    setSizes (styles) {
        this.sizes = {
            height: parseInt(styles.height),
            width: parseInt(styles.width),
            hUnit: Math.floor(parseInt(styles.height) / 100),
            wUnit: Math.floor(parseInt(styles.width) / 100),
        };
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

    changeEnemiesDirection (group, direction) {
        if (direction) {
            this.state.prevDirection = this.state.enemiesDirection;
            this.state.enemiesDirection = direction;
            return;
        }

        if (this.state.enemiesDirection === 'bottom') {
            if (this.state.prevDirection === 'left') {
                this.state.enemiesDirection = 'right';
            } else {
                this.state.enemiesDirection = 'left';
            }

            this.state.prevDirection = 'bottom';
        } else {
            this.state.prevDirection = this.state.enemiesDirection;
            this.state.enemiesDirection = 'bottom';
            group.moveBottomWall(group.enemySize);
        }
    }

    increaseLevel () {
        this.state.level++;
        const speed = this.enemies.getSpeed() + 2;
        this.player.increaseSpeed(2);
        this.changeEnemiesDirection(this.enemies, 'right');
        this.enemies = new EnemiesGroup(this.ctx, this.sizes, speed);
        this.enemies.paint();
        this.start();
    }

    pause () {
        this.state.started = false;
        this.menu.pause(this.score.getScore());
    }

    gameOver () {
        this.state.terminated = true;
        this.state.started = false;
        this.menu.gameOver(this.score.getScore());
    }

    start () {
        let lastTime, timeDiff;
        this.menu.hide();
        if (this.state.terminated) {
            this.state.terminated = false;
            this.initGame();
        };
        this.state.started = true;

        let frame = window.requestAnimationFrame(function drawFrame (time) {
            // Не рисуем, если игра (при)остановлена
            if (!this.state.started) {
                window.cancelAnimationFrame(frame);
                return;
            }

            // Считаем время между кадрами для правильной отрисовки
            timeDiff = time - lastTime || 0;
            lastTime = time;
            this.clearCanvas();

            // Проверяем, добрались ли инопланетяне до игрока
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

            // Проверяем и рисуем все пули и инопланетян
            this.bullets = this.bullets.filter(bullet => {
                // Если пуля улетела за экран - удаляем её
                const { width, height, x, y } = bullet.state;
                let bulletStatus = this.isElementVisible(width, height, x, y);
                if (!bulletStatus || !bullet) return false;

                // Game over, если пуля попала в игрока
                if (this.isElementInside(this.player.state, bullet.state)) {
                    this.gameOver();
                }

                this.enemies.enemies = this.enemies.enemies.filter(enemy => {
                    // Не знаю почему, но это помогает =/
                    if (!bullet) return true;

                    // Убиваем варага при попадании по нему
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

            // Level up, если волна отбита
            if (this.enemies.enemies.length === 0) {
                this.increaseLevel();
                return;
            }

            // Инопланетяне тоже умеют стрелять, но приблизительно
            // 1 раз в 100 кадров / 0.6 раз в секунду
            if (getRandomInt(0, 3000) > 2970) {
                this.enemies.fire(this.bullets, ENEMY_BULLET_COLOR);
            }

            const canEnemiesMove = this.enemies.move(this.state.enemiesDirection, timeDiff);
            if (!canEnemiesMove) {
                this.changeEnemiesDirection(this.enemies);
            }

            if (this.state.movePlayer) {
                this.player.move(this.state.movePlayer, timeDiff);
            } else {
                this.player.paint();
            }

            frame = window.requestAnimationFrame(drawFrame.bind(this));
        }.bind(this));
    }

    handleEnter (event) {
        this.state.started ? this.pause() : this.start();
    }

    handleSpace (event) {
        if (!this.state.started) return;
        this.player.fire(this.bullets, PLAYER_BULLET_COLOR);
    }

    handleArrowLeft (event) {
        if (!this.state.started || this.state.movePlayer === 'right') return;

        if (event.type === 'keydown' || event.type === 'pointerdown') {
            this.state.movePlayer = 'left';
        } else {
            this.state.movePlayer = false;
        }
    }

    handleArrowRight (event) {
        if (!this.state.started || this.state.movePlayer === 'left') return;

        if (event.type === 'keydown' || event.type === 'pointerdown') {
            this.state.movePlayer = 'right';
        } else {
            this.state.movePlayer = false;
        }
    }
}

export default Game;
