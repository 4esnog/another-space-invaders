import Game from './Game';
import Menu from './Menu';

document.addEventListener('DOMContentLoaded', () => {
    const menuNode = document.getElementById('menu');
    const canvas = document.getElementById('game');
    const menu = new Menu(menuNode);
    const game = new Game(canvas, menu);

    window.addEventListener('resize', () => {
        game.resize();
    });

    window.addEventListener('keypress', (event) => {
        switch (event.code) {
            case 'Enter': {
                game.handleEnterEscape(event);
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
});
