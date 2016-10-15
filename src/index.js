import Game from './Game';
import Menu from './Menu';
import Score from './Score';
import Pause from './PauseButton';

document.addEventListener('DOMContentLoaded', () => {
    const pauseButtonNode = document.getElementById('pause-button');
    const menuNode = document.getElementById('menu');
    const menuScoreNode = document.getElementById('menu__score');
    const menuHighestScoreNode = document.getElementById('menu__highest-score');
    const scoreNode = document.getElementById('score');
    const touchControls = document.getElementById('touch-controls');
    const canvas = document.getElementById('game');

    const pause = new Pause(pauseButtonNode);
    const menu = new Menu(menuNode, menuScoreNode, menuHighestScoreNode);
    const score = new Score(scoreNode);
    const game = new Game(canvas, menu, score, pause);

    function handleArrows (event) {
        switch (event.code) {
            case 'ArrowLeft': {
                game.handleArrowLeft(event);
                break;
            }

            case 'ArrowRight': {
                game.handleArrowRight(event);
                break;
            }
        }
    }

    function handleTouchControls (event) {
        switch (event.target.id) {
            case 'left': {
                game.handleArrowLeft(event);
                break;
            }

            case 'right': {
                game.handleArrowRight(event);
                break;
            }
        }
    }

    window.addEventListener('resize', () => {
        game.resize();
    });

    window.addEventListener('keypress', (event) => {
        switch (event.code) {
            case 'Enter': {
                game.handleEnter(event);
                break;
            }
            case 'Space': {
                game.handleSpace(event);
                break;
            }
        }
    });

    window.addEventListener('keydown', handleArrows);
    window.addEventListener('keyup', handleArrows);

    touchControls.addEventListener('pointerdown', handleTouchControls);
    touchControls.addEventListener('pointerup', handleTouchControls);

    menu.node.addEventListener('pointerup', (event) => {
        if (!game.started) {
            game.handleEnter(event);
        }
    });

    pause.node.addEventListener('pointerup', (event) => {
        game.handleEnter(event);
    });
});
