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

    #available = [];
    get available() {
        if (!this.selected) {
            return [];
        }
        const list = [];
        const { position, steps, name } = this.selected;

        const pushOrBreak = (x, y) => {
            if ([x, y].some((el) => el < 0 || el > this.size - 1)) {
                return false;
            }

            const value = { x, y };

            if (!this.grid[x][y].player) {
                list.push(value);
                return true;
            } else if (this.grid[x][y].player !== this.player) {
                list.push(value);
                return false;
            }

            return false;
        };

        if (steps.x) {
            // console.log('can move by x'); вертикальная ось
            if (typeof steps.x === 'boolean') {
                // перемещение по всей оси
                for (let i = position.x - 1; i >= 0; i--) {
                    if (!pushOrBreak(i, position.y)) break;
                }

                for (let i = position.x + 1; i < this.size; i++) {
                    if (!pushOrBreak(i, position.y)) break;
                }
            } else if (typeof steps.x === 'number' && steps.x > 0) {
                // Сдвиг на количество клеток относительно текущей позиции вперед и назад
                for (let i = 1; i <= steps.x; i++) {
                    pushOrBreak(position.x + i, position.y);
                    pushOrBreak(position.x - i, position.y);
                }
            }
        }

        if (steps.y) {
            // console.log('can move by y'); горизонтальная ось
            if (typeof steps.y === 'boolean') {
                // перемещение по всей оси
                for (let i = position.y - 1; i >= 0; i--) {
                    if (!pushOrBreak(position.x, i)) break;
                }

                for (let i = position.y + 1; i < this.size; i++) {
                    if (!pushOrBreak(position.x, i)) break;
                }
            } else if (typeof steps.y === 'number' && steps.y > 0) {
                // Сдвиг на количество клеток относительно текущей позиции вперед и назад
                for (let i = 1; i <= steps.y; i++) {
                    pushOrBreak(position.x, position.y + i);
                    pushOrBreak(position.x, position.y - i);
                }
            }
        }

        if (Array.isArray(steps.x) && Array.isArray(steps.y) && steps.x.length === steps.y.length) {
            // лошадью ходи.
            for (let i = 0, j = 0; i < steps.x.length && i < steps.y.length; i++, j++) {
                let x = position.x - steps.x[i];
                let y = position.y - steps.y[j];
                pushOrBreak(x, y);
                x = position.x - steps.x[i];
                y = position.y + steps.y[j];
                pushOrBreak(x, y);
                x = position.x + steps.x[i];
                y = position.y + steps.y[j];
                pushOrBreak(x, y);
                x = position.x + steps.x[i];
                y = position.y - steps.y[j];
                pushOrBreak(x, y);
            }
        }

        if (steps.d) {
            // console.log('can move by d'); Диагональная ось
            const pushBeam = (x, y, current) => {
                if (current.x === x && current.y === y) {
                    return true;
                }

                return pushOrBreak(x, y);
            };

            if (typeof steps.d === 'boolean') {
                // перемещение по всей оси
                const current = JSON.parse(JSON.stringify(position));

                // Тут очень грустно, 4 луча = 4 ича, чтобы оборвать если "наткнулся" на препятствие.

                for (let x = current.x, y = current.y; x >= 0 && y >= 0; x--, y--) {
                    if (!pushBeam(x, y, current)) break;
                }

                for (let x = current.x, y = current.y; x >= 0 && y < this.size; x--, y++) {
                    if (!pushBeam(x, y, current)) break;
                }

                for (let x = current.x, y = current.y; x < this.size && y >= 0; x++, y--) {
                    if (!pushBeam(x, y, current)) break;
                }

                for (let x = current.x, y = current.y; x < this.size && y < this.size; x++, y++) {
                    if (!pushBeam(x, y, current)) break;
                }
            } else if (typeof steps.d === 'number' && steps.d > 0) {
                // Сдвиг на количество клеток относительно текущей позиции вперед. И назад если єто король
                switch (true) {
                    case this.player === 'white':
                        for (let i = 1; i <= steps.d; i++) {
                            pushOrBreak(position.x - i, position.y - i);
                            pushOrBreak(position.x - i, position.y + i);
                            if (name === 'king') {
                                pushOrBreak(position.x + i, position.y - i);
                                pushOrBreak(position.x + i, position.y + i);
                            }
                        }
                        break;
                    case this.player === 'dark':
                        for (let i = 1; i <= steps.d; i++) {
                            pushOrBreak(position.x + i, position.y - i);
                            pushOrBreak(position.x + i, position.y + i);
                            if (name === 'king') {
                                pushOrBreak(position.x - i, position.y - i);
                                pushOrBreak(position.x - i, position.y + i);
                            }
                        }
                        break;
                }
            }
        }

        // console.log('target: list', position, steps, filtered, list);

        return list.filter((item) => item.x > -1 && item.y > -1 && item.x < this.size && item.y < this.size);
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

    _moveAndSubmit(evt) {
        if (!Object.keys(KEYS).includes(evt.which.toString())) {
            return false;
        }

        evt.preventDefault();

        const current = JSON.parse(JSON.stringify(this.focused.position));
        const direction = KEYS[evt.which];

        switch (true) {
            case direction === 'esc':
                this.focused = this.selected;
                this.selected = null;
                this._noticeMove();
                this._render();
                break;
            case direction === 'enter':
                if (!this.selected) {
                    this._selectFigureByPlayer();
                } else {
                    this._replaceFigureByPlayer();
                }
                this._render();
                break;
            case direction === 'top' && current.x > 0:
                current.x = current.x - 1;
                break;
            case direction === 'bottom' && current.x < this.size - 1:
                current.x = current.x + 1;
                break;
            case direction === 'right' && current.y < this.size - 1:
                current.y = current.y + 1;
                break;
            case direction === 'left' && current.y > 0:
                current.y = current.y - 1;
                break;
        }

        this.focused = this.grid[current.x][current.y];
    }

    _selectFigureByPlayer() {
        if (this.focused.player !== this.player) {
            return false;
        }

        this.selected = this.focused;
        this._noticeSelect();
    }

    _replaceFigureByPlayer() {
        if (this.focused.player === this.player) {
            // TODO casting if needed
            return false;
        }

        if (this.available.length === 0) {
            return false;
        }

        const oldCord = JSON.parse(JSON.stringify(this.selected.position));
        const newCord = JSON.parse(JSON.stringify(this.focused.position));

        if (!this.available.some((el) => el.x === newCord.x && el.y === newCord.y)) {
            return false;
        }

        const instance = new Figure();

        this.grid[newCord.x][newCord.y] = this.selected;
        this.grid[oldCord.x][oldCord.y] = instance;

        instance.position = oldCord;

        this.selected.position = newCord;

        this.selected = null;
        this.focused = null;
        this.player = this.player === 'white' ? 'dark' : 'white';

        this._focusFirst();
        this._noticeMove();
    }

    _render() {
        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        this.root.innerHTML = '';
        this.grid.forEach((row, idx) => {
            row.forEach((instance, jdx) => {
                const { x, y } = JSON.parse(JSON.stringify(instance.position));
                instance.setColor(x, y);
                instance.container.classList.remove('highlights');
                instance.container.removeAttribute('data-key-x');
                instance.container.removeAttribute('data-key-y');

                if (idx === 0) {
                    instance.container.setAttribute('data-key-x', letters[jdx]);
                }

                if (jdx === 0) {
                    instance.container.setAttribute('data-key-y', this.size - idx);
                }

                const available = JSON.parse(JSON.stringify(this.available));
                if (available.length > 0 && available.some((el) => el.x === x && el.y === y)) {
                    instance.container.classList.add('highlights');
                }

                this.root.insertAdjacentElement('beforeend', instance.container);
            });
        });

        console.log('_render: this', this);
    }

    _noticeMove() {
        if (this.action) {
            this.action.innerHTML = `<b>${this.player}:</b> make your move. Use the keyboard arrows for move. To confirm, press enter.`;
        }
    }

    _noticeSelect() {
        if (this.action) {
            this.action.innerHTML = `<b>${this.player}:</b> select a highlights position to move. To cancel press "esc"`;
        }
    }
}
