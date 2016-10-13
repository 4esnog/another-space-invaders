import Game from './Game';
import Menu from './Menu';
import Score from './Score';

document.addEventListener('DOMContentLoaded', () => {
    const menuNode = document.getElementById('menu');
    const menuScoreNode = document.getElementById('menu__score');
    const menuHighestScoreNode = document.getElementById('menu__highest-score');
    const scoreNode = document.getElementById('score');
    const touchControls = document.getElementById('touch-controls');
    const canvas = document.getElementById('game');

    const menu = new Menu(menuNode, menuScoreNode, menuHighestScoreNode);
    const score = new Score(scoreNode);
    const game = new Game(canvas, menu, score);

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

    window.addEventListener('keydown', handleArrows);
    window.addEventListener('keyup', handleArrows);

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

    touchControls.addEventListener('pointerdown', handleTouchControls);
    touchControls.addEventListener('pointerup', handleTouchControls);

    menu.node.addEventListener('pointerup', (event) => {
        if (!game.started) {
            game.handleEnter(event);
        }
    });
});
