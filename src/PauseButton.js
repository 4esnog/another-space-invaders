class Pause {
    constructor (node) {
        this.node = node;
    }

    showPause () {
        const classes = this.node.classList;
        classes.add('pause-button_pause');
        classes.remove('pause-button_play');
    }

    showPlay () {
        const classes = this.node.classList;
        classes.add('pause-button_play');
        classes.remove('pause-button_pause');
    }
}

export default Pause;
