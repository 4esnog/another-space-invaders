class Score {
    constructor (node) {
        this.node = node;
    }

    update (points) {
        this.node.innerHTML = points;
    }
}

export default Score;
