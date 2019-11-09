class Row {
    constructor(dom) {
        this.cols = dom.children;
    }

    static updateRows(rows, map) {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                rows[i].cols[j].innerText = map[i][j];
            }
        }
    }
}

class Game {

    constructor(options = {}) {
        this.status = false;
        this.score = 0;
        this.colData = options.colData || [2, 4];
        let colDataWeight = options.colDataWeight || [2, 1];
        this.colDataWeight = [colDataWeight[0]];
        for (let i = 1; i < colDataWeight.length; i++)
            this.colDataWeight[i] = colDataWeight[i] + colDataWeight[i - 1];

        this.game = document.createElement('div');
        this.game.classList.add('game');

        this.header = document.createElement('header');
        this.ele = document.createElement('div');
        this.game.appendChild(this.header);
        this.game.appendChild(this.ele);
        document.body.appendChild(this.game);
        document.addEventListener('keydown', this.keyDownEvent.bind(this));
    }

    initialize(size = 4) {
        this.score = 0;
        this.ele.innerHTML = '';
        this.ele.style.width = `${size*100}px`;
        this.ele.style.height = `${size*100}px`;
        this.map = new Array(size).fill(0).map(() => new Array(size).fill(null));
        this.rows = [];

        for (let i = 1; i <= size; i++) {
            let row = document.createElement('div');
            row.classList.add('row');
            for (let j = 1; j <= size; j++) {
                let col = document.createElement('div');
                col.classList.add('col');
                row.appendChild(col);
            }
            this.rows.push(new Row(row));
            this.ele.appendChild(row);
        }

        Row.updateRows(this.rows, this.map);
        this.status = true;
    }

    start() {
        Alert.prompt("Input Game Size", 4, {
            type: 'number',
            placeholder: 'Default Size = 4'
        }).then(size => {
            if (!(size >= 2 && size <= 10)) {
                Alert.showMessage('Size must be between 2 and 10.')
                    .then(() => {
                        this.start();
                    });
                return;
            }

            this.initialize(size);
            this.nextPosition = this.getMapRandomNullPosition();
            this.next();
        })
    }

    hasNext() {
        if (this.mapExistsNullPosition())
            return true;

        for (let i = 0; i < this.map.length; i++) {
            var previous = this.map[i][0];
            for (let j = 1; j < this.map[i].length; j++) {
                var current = this.map[i][j];
                if (current !== null && previous === current)
                    return true;
                previous = current;
            }
        }

        for (let i = 0; i < this.map[0].length; i++) {
            var previous = this.map[0][i];
            for (let j = 1; j < this.map.length; j++) {
                var current = this.map[j][i];
                if (current !== null && previous === current)
                    return true;
                previous = current;
            }
        }

        return false;
    }

    next() {
        let {
            i,
            j
        } = this.getMapRandomNullPosition();
        this.map[i][j] = this.getNextData();
        Row.updateRows(this.rows, this.map);
        this.header.innerHTML = `Score: ${this.score}`;
        if (!this.hasNext())
            return this.gameOver();
    }

    getNextData() {
        let weight = Math.floor(Math.random() * this.colDataWeight[this.colDataWeight.length - 1]);
        let target = this.colDataWeight.filter(x => x > weight)[0];
        let index = this.colDataWeight.indexOf(target);
        return this.colData[index];
    }

    keyDownEvent(e) {
        if (this.status) {
            e.keyCode == 37 ? this.left() :
                e.keyCode == 38 ? this.top() :
                e.keyCode == 39 ? this.right() :
                e.keyCode == 40 ? this.down() : null;
        }
    }

    top() {
        var validOperation = false;
        for (let i = 0; i < this.map[0].length; i++) {
            for (let j = 1; j < this.map.length; j++) {
                while (j > 0 && this.map[j][i] !== null && this.map[j - 1][i] === null) {
                    this.map[j - 1][i] = this.map[j][i];
                    this.map[j][i] = null;
                    j--;
                    validOperation = true;
                }

                if (j > 0 && this.map[j][i] !== null && this.map[j][i] === this.map[j - 1][i]) {
                    this.score += this.map[j][i] * 2;
                    this.map[j - 1][i] = this.map[j][i] * 2;
                    this.map[j][i] = null;
                    validOperation = true;
                }
            }
        }
        if (validOperation)
            this.next();
    }

    down() {
        var validOperation = false;
        for (let i = 0; i < this.map[0].length; i++) {
            for (let j = this.map.length - 1; j >= 0; j--) {
                while (j < this.map.length - 1 && this.map[j][i] !== null && this.map[j + 1][i] === null) {
                    this.map[j + 1][i] = this.map[j][i];
                    this.map[j][i] = null;
                    j++;
                    validOperation = true;
                }

                if (j < this.map.length - 1 && this.map[j][i] !== null && this.map[j][i] === this.map[j + 1][i]) {
                    this.score += this.map[j][i] * 2;
                    this.map[j + 1][i] = this.map[j][i] * 2;
                    this.map[j][i] = null;
                    validOperation = true;
                }
            }
        }
        if (validOperation)
            this.next();
    }

    left() {
        var validOperation = false;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 1; j < this.map[i].length; j++) {
                while (this.map[i][j] !== null && this.map[i][j - 1] === null) {
                    this.map[i][j - 1] = this.map[i][j];
                    this.map[i][j] = null;
                    j--;
                    validOperation = true;
                }

                if (this.map[i][j] !== null && this.map[i][j] === this.map[i][j - 1]) {
                    this.score += this.map[i][j] * 2;
                    this.map[i][j - 1] = this.map[i][j] * 2;
                    this.map[i][j] = null;
                    validOperation = true;
                }
            }
        }
        if (validOperation)
            this.next();
    }

    right() {
        var validOperation = false;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = this.map[i].length - 2; j >= 0; j--) {
                while (this.map[i][j] !== null && this.map[i][j + 1] === null) {
                    this.map[i][j + 1] = this.map[i][j];
                    this.map[i][j] = null;
                    j++;
                    validOperation = true;
                }

                if (this.map[i][j] !== null && this.map[i][j] === this.map[i][j + 1]) {
                    this.score += this.map[i][j] * 2;
                    this.map[i][j + 1] = this.map[i][j] * 2;
                    this.map[i][j] = null;
                    validOperation = true;
                }
            }
        }
        if (validOperation)
            this.next();
    }

    mapExistsNullPosition() {
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.map[i][j] == null)
                    return true;
            }
        }
        return false;
    }

    getMapRandomNullPosition() {

        let pair = [];
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.map[i][j] == null)
                    pair.push({
                        i,
                        j
                    });
            }
        }

        return pair[Math.floor(Math.random() * pair.length)];
    }

    gameOver() {
        Alert.showMessage('Game Over', {
            textAlign: 'center',
            buttonText: 'Restart'
        }).then(() => {
            this.start();
        })
    }
}

class Alert {

    constructor(options = {}) {
        let ele = document.createElement('div');
        ele.style.width = '100vw';
        ele.style.height = '100vh';
        ele.style.background = '#ddd3';
        ele.style.position = 'fixed';
        ele.style.display = 'flex';
        ele.style.alignItems = 'center';
        ele.style.justifyContent = 'center';

        let alert = document.createElement('div');
        alert.style.transform = 'scale(0)';
        alert.style.transition = 'transform .35s';
        alert.style.background = '#fff';
        alert.style.border = '1px solid #333';
        alert.style.borderRadius = '7px';
        alert.style.minWidth = '250px';
        alert.style.minHeight = '100px';
        alert.style.fontSize = '20px';
        alert.style.textAlign = 'center';

        let header = document.createElement('div');
        header.style.background = '#39f6';
        header.style.padding = '10px';
        header.style.marginBottom = '5px';
        header.innerText = options.headerText || 'Message';

        let msg = document.createElement('div');
        msg.append(options.messageBody);
        msg.style.textAlign = options.textAlign || 'left';
        msg.style.padding = '0 10px';

        let button = document.createElement('button');
        button.innerText = options.buttonText || 'OK';
        button.style.padding = '3px 7px';
        button.style.background = '#ebbb72';
        button.style.border = '0';
        button.style.borderRadius = '5px';
        button.style.minWidth = '50px';
        button.style.height = '30px';
        button.style.margin = '8px';
        button.style.cursor = 'pointer';

        button.addEventListener('mouseover', function () {
            this.style.background = '#ebbb7277';
        });

        button.addEventListener('mouseleave', function () {
            this.style.background = '#ebbb72';
        });

        var globalEnterEvent = function (e) {
            if (e.keyCode == 13) {
                button.click();
            }
        }

        button.addEventListener('click', () => {
            document.removeEventListener('keydown', globalEnterEvent);
            alert.style.transform = 'scale(0)';
            setTimeout(() => {
                ele.remove();
                options.resolve();
            }, 350);
        });

        document.addEventListener('keydown', globalEnterEvent)

        alert.appendChild(header);
        alert.appendChild(msg);
        alert.appendChild(button);
        ele.append(alert);
        document.body.appendChild(ele);

        setTimeout(() => {
            alert.style.transform = 'scale(1)';
        }, 25);

        if (options.callback !== undefined)
            options.callback();
    }

    static async showMessage(message, options = {}) {
        return new Promise(resolve => {
            return new Alert({
                ...options,
                messageBody: message,
                resolve
            });
        });
    }

    static async prompt(message, defaultValue = 4, options = {}) {
        var input = document.createElement('input');
        input.style.border = '1px solid #333';
        input.style.borderRadius = '3px';
        input.style.height = '26px';
        input.style.width = '80%';
        input.style.fontSize = '20px';
        input.style.marginTop = '3px';

        for (let option in options) {
            if (option in input.__proto__) {
                input[option] = options[option];
            }
        }

        return new Promise(resolve => {
            return new Alert({
                ...options,
                headerText: message,
                messageBody: input,
                textAlign: 'center',
                resolve,
                callback: function () {
                    input.focus();
                }
            });
        }).then(() => {
            return +input.value || defaultValue;
        });
    }

}

var game = new Game();
game.start();