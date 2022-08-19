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

    #position = null;
    get position() {
        return this.#position;
    }
    set position(info) {
        this.#position = info;
        this._render();
    }

    #steps = { x: false, y: false, d: false };
    get steps() {
        return this.#steps;
    }
    set steps(info) {
        this.#steps = info;
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

    // inRow = size from Builder
    calcIndex(inRow = 5) {
        if (this.position) {
            return this.position.x * inRow + this.position.y;
        }
        return '';
    }

    _render() {
        let index = this.calcIndex();

        if (this.player) {
            this.container.innerHTML = `<a href="javascript: void(0)">${this.name} ${JSON.stringify(this.position)}${index}</a>`;
        } else {
            this.container.innerHTML = `<a href="javascript: void(0)">${JSON.stringify(this.position)}${index}</a>`;
        }
    }
}

export class RookFigure extends Figure {
    constructor(player) {
        super(player, 'Rook');
        this.steps = { x: true, y: true, d: false };
    }
}

export class KnightFigure extends Figure {
    constructor(player) {
        super(player, 'Knight');
        this.steps = { x: [1, 2], y: [2, 1], d: false };
    }
}

export class BishopFigure extends Figure {
    constructor(player) {
        super(player, 'Bishop');
        this.steps = { x: false, y: false, d: true };
    }
}

export class QueenFigure extends Figure {
    constructor(player) {
        super(player, 'Queen');
        this.steps = { x: true, y: true, d: true };
    }
}

export class KingFigure extends Figure {
    constructor(player) {
        super(player, 'King');
        this.steps = { x: 1, y: 1, d: 1 };
    }
}

export class PawnFigure extends Figure {
    constructor(player) {
        super(player, 'Pawn');
        this.steps = { x: false, y: false, d: 1 };
    }
}
