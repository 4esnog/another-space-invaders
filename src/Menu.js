class Menu {
    constructor (node, scoreNode, highestScoreNode) {
        this.node = node;
        this.scoreNode = scoreNode;
        this.highestScoreNode = highestScoreNode;
    }

    gameOver (score) {
        this.node.classList.add('menu_show-gameover');
        this.node.classList.add('menu_show-score');
        this.scoreNode.innerHTML = score.current;
        this.highestScoreNode.innerHTML = score.highest;
        this.show();
    }

    pause (score) {
        this.node.classList.remove('menu_show-gameover');
        this.node.classList.add('menu_show-score');
        this.scoreNode.innerHTML = score.current;
        this.highestScoreNode.innerHTML = score.highest;
        this.show();
    }

    show () {
        this.node.style.display = 'flex';
    }

    hide () {
        this.node.style.display = 'none';
    }
}

export default Menu;
