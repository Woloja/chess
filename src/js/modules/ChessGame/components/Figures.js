export class Figure {
    #name = '';
    get name() {
        return this.#name;
    }
    set name(str) {
        this.#name = str.toLowerCase();
    }

    #container = null;
    get container() {
        return this.#container;
    }
    set container(element) {
        this.#container = element;
    }

    #player = '';
    get player() {
        return this.#player;
    }
    set player(str) {
        if (str && ['white', 'dark'].includes(str)) {
            this.#player = str;
            this.container.classList.add(this.player, 'player');
        }

        this.container.classList.add('chess-item');
        this._render();
    }

    #position = -1;
    get position() {
        return this.#position;
    }
    set position(info) {
        this.#position = info;
        this._render();
    }

    constructor(player, name = '') {
        this.container = document.createElement('div');
        this.name = name;
        this.player = player;

        return this;
    }

    setColor(x, y) {
        if (!this.container) {
            throw new Error('Must render before set color');
        }
        let colors = ['#ffce9e', '#d18b47'];

        if (x % 2 === 1) {
            colors = colors.reverse();
        }
        this.container.style.background = colors[y % 2];
    }

    _render() {
        if (this.player) {
            this.container.innerHTML = `<a href="javascript: void(0)">${this.name} ${JSON.stringify(this.position)}</a>`;
        } else {
            this.container.innerHTML = `<a href="javascript: void(0)">${JSON.stringify(this.position)}</a>`;
        }
    }
}

export class RookFigure extends Figure {
    constructor(player) {
        super(player, 'Rook');
    }
}

export class KnightFigure extends Figure {
    constructor(player) {
        super(player, 'Knight');
    }
}

export class BishopFigure extends Figure {
    constructor(player) {
        super(player, 'Bishop');
    }
}

export class QueenFigure extends Figure {
    constructor(player) {
        super(player, 'Queen');
    }
}

export class KingFigure extends Figure {
    constructor(player) {
        super(player, 'King');
    }
}

export class PawnFigure extends Figure {
    constructor(player) {
        super(player, 'Pawn');
    }
}
