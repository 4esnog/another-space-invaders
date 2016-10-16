class IconButton {
    constructor (node, stateOne, stateTwo) {
        this.node = node;
        this.stateOne = stateOne;
        this.stateTwo = stateTwo;
        this.currentState = this.stateOne;
    }

    switch () {
        if (this.currentState === this.stateOne) {
            return this.showStateTwo();
        } else {
            return this.showStateOne();
        }
    }

    showStateOne () {
        const classes = this.node.classList;
        classes.add(this.stateOne);
        classes.remove(this.stateTwo);

        this.currentState = this.stateOne;
        return 1;
    }

    showStateTwo () {
        const classes = this.node.classList;
        classes.add(this.stateTwo);
        classes.remove(this.stateOne);

        this.currentState = this.stateTwo;
        return 2;
    }
}

export default IconButton;
