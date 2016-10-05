import Game from './Game';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game');
    const game = new Game(canvas);

    window.addEventListener('resize', () => {
        game.resize();
    });
});
