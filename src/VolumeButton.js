import IconButton from './IconButton';

class VolumeButton extends IconButton {
    showUnmuted () {
        super.showStateOne();
    }

    showMuted () {
        super.showStateTwo();
    }
}

export default VolumeButton;
