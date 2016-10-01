// import Game from './Game';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game');
    const styles = window.getComputedStyle(canvas);
    canvas.width = parseInt(styles.width);
    canvas.height = parseInt(styles.height);
});
