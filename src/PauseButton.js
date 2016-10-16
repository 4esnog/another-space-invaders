import IconButton from './IconButton';

class PauseButton extends IconButton {
    showPause () {
        super.showStateOne();
    }

    showPlay () {
        super.showStateTwo();
    }
}

export default PauseButton;
