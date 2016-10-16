import Game from './Game';
import Menu from './Menu';
import Score from './Score';
import PauseButton from './PauseButton';
import VolumeButton from './VolumeButton';

const sounds = {
    player: 'audio/blaster-1.wav',
    enemy: 'audio/blaster-2.wav',
    explosion: 'audio/blaster-3.wav',
    gameOver: 'audio/game-over.mp3',
    levelUp: 'audio/level-up.wav',
};

document.addEventListener('DOMContentLoaded', () => {
    // Все audio элементы подключаем в общую gainNode, чтобы контролировать
    // громкость всех звуков в одном месте
    function initMainGain (sounds) {
        const audioCtx = new window.AudioContext();
        const gainNode = audioCtx.createGain();

        for (let key in sounds) {
            const source = audioCtx.createMediaElementSource(sounds[key]);
            source.connect(gainNode);
        }

        gainNode.connect(audioCtx.destination);
        return gainNode;
    }

    const menuNode = document.getElementById('menu');
    const menuScoreNode = document.getElementById('menu__score');
    const menuHighestScoreNode = document.getElementById('menu__highest-score');

    const pauseButtonNode = document.getElementById('pause-button');
    const volumeButtonNode = document.getElementById('volume-button');
    const scoreNode = document.getElementById('score');
    const touchControls = document.getElementById('touch-controls');
    const canvas = document.getElementById('game');

    for (let key in sounds) {
        sounds[key] = new window.Audio(sounds[key]);
    }
    const mainGain = initMainGain(sounds);

    const pause = new PauseButton(pauseButtonNode, 'pause-button_pause', 'pause-button_play');
    const volume = new VolumeButton(volumeButtonNode, 'volume-button_on', 'volume-button_off');
    const menu = new Menu(menuNode, menuScoreNode, menuHighestScoreNode);
    const score = new Score(scoreNode);
    const game = new Game(canvas, menu, score, pause, sounds);

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

    window.addEventListener('keydown', handleArrows);
    window.addEventListener('keyup', handleArrows);

    touchControls.addEventListener('pointerdown', handleTouchControls);
    touchControls.addEventListener('pointerup', handleTouchControls);

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

    menu.node.addEventListener('pointerup', (event) => {
        if (!game.started) {
            game.handleEnter(event);
        }
    });

    pause.node.addEventListener('pointerup', (event) => {
        game.handleEnter(event);
    });

    volume.node.addEventListener('pointerup', (event) => {
        mainGain.gain.value = volume.switch() % 2;
    });
});
