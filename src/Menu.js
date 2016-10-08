class Menu {
    constructor (node) {
        this.node = node;
    }

    show () {
        this.node.style.display = 'flex';
    }

    hide () {
        this.node.style.display = 'none';
    }
}

export default Menu;
