// ['Rook', { row: 0, column: 1 }],
// ['Knight', { row: 0, column: 1 }],
// ['Bishop', { row: 0, column: 1 }],
// ['Queen', { row: 0, column: 1 }],
// ['King', { row: 0, column: 1 }],
// ['Pawn', { row: 0, column: 1 }]

export default class ChessGame {
    /**
     * @type {HTMLElement}
     */
    #root = null;
    get root() {
        return this.#root;
    }
    set root(element) {
        this.#root = element;
    }

    #grid = [];
    get grid() {
        return this.#grid;
    }
    set grid(size) {
        const result = [];
        for (let i = 0; i < size; i++) {
            result.push([]);
            for (let j = 0; j < size; j++) {
                result[i].push(this.factory(i, j));
            }
        }

        this.#grid = result;
    }

    /**
     * Chess Builder
     * @param {String} root
     * @param {Object} opts
     * @param {Number} opts.size. Default - 0
     * @property {HTMLElement} root
     */
    constructor(root, opts = { size: 0 }) {
        if (typeof root !== 'string') {
            throw new TypeError('Available only strings');
        } else {
            this.root = document.querySelector(root);
        }

        if (opts.size !== 5) {
            throw new Error('Options size must be 5 :)');
        } else {
            this.size = opts.size;
            this.grid = opts.size;
        }

        this.install();

        return this;
    }

    factory(x, y) {
        let instance;
        const player = [0, 1].includes(x) ? 'dark' : 'white';

        if (x === 1 || x === this.size - 2) {
            instance = new PawnFigure(player);
        } else if (x === 0 || x === this.size - 1) {
            switch (y) {
                case 0:
                    instance = new RookFigure(player);
                    break;
                case 1:
                    instance = new KnightFigure(player);
                    break;
                case 2:
                    instance = new BishopFigure(player);
                    break;
                case 3:
                    instance = new QueenFigure(player);
                    break;
                case 4:
                    instance = new KingFigure(player);
                    break;
            }
        } else {
            instance = new Figure();
        }

        this.root.insertAdjacentElement('beforeend', instance.container);
        instance.setColor(x, y);
        instance.position = { x, y };

        return instance;
    }

    install() {
        this.root.style.display = 'grid';
        this.root.style.gridTemplateColumns = `repeat(${this.grid.length}, 1fr)`;
        console.log('target: this', this);
    }
}

class Figure {
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
        this.#position = info.x + info.y * info.y;
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
            this.container.innerHTML = `<a href="javascript: void(0)">${this.name} ${this.position}</a>`;
        } else {
            this.container.innerHTML = `<a href="javascript: void(0)">${this.position}</a>`;
        }
    }
}

class RookFigure extends Figure {
    constructor(player) {
        super(player, 'Rook');
    }
}

class KnightFigure extends Figure {
    constructor(player) {
        super(player, 'Knight');
    }
}

class BishopFigure extends Figure {
    constructor(player) {
        super(player, 'Bishop');
    }
}

class QueenFigure extends Figure {
    constructor(player) {
        super(player, 'Queen');
    }
}

class KingFigure extends Figure {
    constructor(player) {
        super(player, 'King');
    }
}

class PawnFigure extends Figure {
    constructor(player) {
        super(player, 'Pawn');
    }
}
