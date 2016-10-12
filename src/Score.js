class Score {
    constructor (node, points) {
        this.node = node;
        this.points = points;
    }

    wipe () {
        this.points = 0;
        this.highestScore = this.highestScore || 0;
        this.node.innerHTML = '0';
    }

    update (diff) {
        this.points += diff;
        this.highestScore = (this.points > this.highestScore)
            ? this.points
            : this.highestScore;
        this.node.innerHTML = this.points;
    }

    getScore () {
        return {
            current: this.points,
            highest: this.highestScore,
        };
    }
}

export default Score;
