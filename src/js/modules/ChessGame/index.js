import { Figure, BishopFigure, KingFigure, KnightFigure, PawnFigure, QueenFigure, RookFigure } from './components/Figures';
const KEYS = { 13: 'enter', 27: 'esc', 37: 'left', 38: 'top', 39: 'right', 40: 'bottom' };

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
                result[i].push(this._factory(i, j));
            }
        }
        this.#grid = result;
    }

    #player = '';
    get player() {
        return this.#player;
    }
    set player(player) {
        this.#player = player;
    }

    #focused = null;
    get focused() {
        return this.#focused;
    }
    set focused(instance) {
        if (this.#focused) {
            this.#focused.container.classList.remove('focused');
        }

        if (instance) {
            instance.container.classList.add('focused');
        }
        this.#focused = instance;
    }

    #selected = null;
    get selected() {
        return this.#selected;
    }
    set selected(instance) {
        if (this.#selected) {
            this.#selected.container.classList.remove('selected');
        }
        if (instance) {
            instance.container.classList.add('selected');
        }
        this.#selected = instance;
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

    install() {
        this.root.style.display = 'grid';
        this.root.style.gridTemplateColumns = `repeat(${this.grid.length}, 1fr)`;
        this.action = document.querySelector('#action');
        this._render();
    }

    start() {
        this.player = 'white';
        window.addEventListener('keydown', this._moveAndSubmit.bind(this));
        this._focusFirst();
        this._noticeMove();

        return this;
    }

    _factory(x, y) {
        let instance;
        const player = [0, 1].includes(x) ? 'dark' : 'white';

        if (x === 1 || x === this.size - 2) {
            instance = new PawnFigure(player);
            // instance = new Figure();
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

        instance.position = { x, y };

        return instance;
    }

    _moveAndSubmit(evt) {
        if (!Object.keys(KEYS).includes(evt.which.toString())) {
            return false;
        }

        const current = JSON.parse(JSON.stringify(this.focused.position));
        const direction = KEYS[evt.which];

        if (direction === 'esc') {
            this.focused = this.selected;
            this.selected = null;
            this._noticeMove();
        } else if (direction === 'enter') {
            if (!this.selected) {
                this.selected = this.focused;
                this._noticeSelect();
            } else {
                this._replace();
            }
        } else if (direction === 'top' && current.x > 0) {
            current.x = current.x - 1;
        } else if (direction === 'bottom' && current.x < this.size - 1) {
            current.x = current.x + 1;
        } else if (direction === 'right' && current.y < this.size - 1) {
            current.y = current.y + 1;
        } else if (direction === 'left' && current.y > 0) {
            current.y = current.y - 1;
        }

        this.focused = this.grid[current.x][current.y];
    }

    _focusFirst() {
        let select = null;
        for (let row of this.grid) {
            select = row.find((el) => el.player === this.player);
            if (select) {
                break;
            }
        }

        this.focused = select;
    }

    _replace() {
        if (this.focused.player === this.player) {
            // TODO casting if needed
            return false;
        }

        const position = this.selected.position;
        const instance = new Figure();
        this.grid[this.focused.position.x][this.focused.position.y] = this.selected;
        this.grid[position.x][position.y] = instance;
        instance.position = { x: position.x, y: position.y };
        this.selected.position = { x: this.focused.position.x, y: this.focused.position.y };

        this.selected = null;
        this.focused = null;
        if (this.player === 'white') {
            this.player = 'dark';
        } else {
            this.player = 'white';
        }
        this._render();
        this._focusFirst();
        this._noticeMove();
    }

    _render() {
        this.root.innerHTML = '';
        this.grid.forEach((row) => {
            row.forEach((instance) => {
                const { x, y } = instance.position;
                this.root.insertAdjacentElement('beforeend', instance.container);
                instance.setColor(x, y);
            });
        });
    }

    _noticeMove() {
        if (this.action) {
            this.action.innerHTML = `<b>${this.player}:</b> make your move. Use the keyboard arrows to move. To confirm, press enter.`;
        }
    }

    _noticeSelect() {
        if (this.action) {
            this.action.innerHTML = `<b>${this.player}:</b> select a position to move. To cancel press "esc"`;
        }
    }
}
