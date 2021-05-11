class Direction {
    static left = "left";
    static right = "right";
    static up = "up";
    static down = "down";
}

class Chess {
    constructor() {
        this._num = 0;
        this.color = "white";
    }

    randomNum() {
        const num4Rate = 10;
        let randomNum = MathUtil.getRandomNum(100);
        if (randomNum < num4Rate) {
            this.num = 4;
        } else {
            this.num = 2;
        }
    }

    get num() {
        return this._num;
    }

    set num(newValue) {
        this._num = newValue;
        this.color = this.getChessColor(newValue)
    }

    getChessColor(num) {
        if (num >= 16 && num < 64) {
            return "#00BCD4";
        }

        if (num >= 64 && num < 256) {
            return "#2196F3";
        }

        if (num >= 256 && num < 1024) {
            return "#9C27B0";
        }

        if (num >= 1024) {
            return "#e50652";
        }

        return "white";
    }
}

class Chessboard {
    #size = 4;

    constructor(size) {
        this.#size = size
        this.isFull = false;

        this.clearChessInfo();
        this.initChessboard();
        this.generateChess();
    }

    clearChessInfo() {
        this.chessInfo = {
            move: new Map(),
            generate: []
        }
    }

    initChessboard() {
        this.chessList = [];
        for (let i = 0; i < this.#size; i++) {
            this.chessList.push([]);

            for (let j = 0; j < this.#size; j++) {
                this.chessList[i][j] = new Chess();
            }
        }
    }

    generateChess() {
        const [x, y] = this.calcNewChessLoc();;
        this.chessList[x][y].randomNum();
        this.chessInfo.generate = [x, y];
    }

    calcNewChessLoc() {
        let restPositions = this.getRestPositions();
        if (restPositions.length === 0) {
            return null;
        };

        let randomIndex = MathUtil.getRandomNum(restPositions.length);
        let newChessPosition = restPositions[randomIndex];

        return [Math.floor(newChessPosition / this.#size), newChessPosition % this.#size];
    }

    getRestPositions() {
        let positions = [];

        for (let i = 0; i < this.#size; i++) {
            for (let j = 0; j < this.#size; j++) {
                if (!this.hasChess(i, j)) {
                    positions.push(i * this.#size + j);
                }
            }
        }

        return positions;
    }

    moveTo(direction) {
        if (this.isFull) return;

        let chessMoved = false;
        this.clearChessInfo();

        switch (direction) {
            case Direction.left: chessMoved = this.moveToLeft(); break;
            case Direction.right: chessMoved = this.moveToRight(); break;
            case Direction.up: chessMoved = this.moveToTop(); break;
            case Direction.down: chessMoved = this.moveToBottom(); break;
        }

        if (chessMoved)
            this.generateChess();
        else
            this.validateChessboardIsFull();

    }

    moveToLeft() {
        let chessMoved = false;

        for (let i = 0; i < this.#size; i++) {
            let numIndex = 0;
            for (let j = 1; j < this.#size; j++) {
                let curChess = this.chessList[i][numIndex];
                let nextChess = this.chessList[i][j];

                if (curChess.num !== 0 && nextChess.num !== 0) {
                    if (curChess.num === nextChess.num) {
                        curChess.num *= 2;
                        nextChess.num = 0;
                        chessMoved = true;
                        this.chessInfo.move.set([i, j], [i, numIndex]);
                    } else if (numIndex + 1 !== j) {
                        this.chessList[i][numIndex + 1].num = nextChess.num;
                        nextChess.num = 0;
                        chessMoved = true;
                        this.chessInfo.move.set([i, j], [i, numIndex + 1]);
                    }
                    numIndex++;
                    continue;
                }

                if (nextChess.num !== 0) {
                    curChess.num = nextChess.num;
                    nextChess.num = 0;
                    chessMoved = true;
                    this.chessInfo.move.set([i, j], [i, numIndex]);
                }
            }
        }

        return chessMoved;
    }

    moveToRight() {
        let chessMoved = false;

        for (let i = 0; i < this.#size; i++) {
            let numIndex = this.#size - 1;
            for (let j = this.#size - 2; j >= 0; j--) {
                let curChess = this.chessList[i][numIndex];
                let nextChess = this.chessList[i][j];

                if (curChess.num !== 0 && nextChess.num !== 0) {
                    if (curChess.num === nextChess.num) {
                        curChess.num *= 2;
                        nextChess.num = 0;
                        chessMoved = true;
                        this.chessInfo.move.set([i, j], [i, numIndex]);
                    } else if (numIndex - 1 !== j) {
                        this.chessList[i][numIndex - 1].num = nextChess.num;
                        nextChess.num = 0;
                        chessMoved = true;
                        this.chessInfo.move.set([i, j], [i, numIndex - 1]);
                    }
                    numIndex--;
                    continue;
                }

                if (nextChess.num !== 0) {
                    curChess.num = nextChess.num;
                    nextChess.num = 0;
                    chessMoved = true;
                    this.chessInfo.move.set([i, j], [i, numIndex]);
                }
            }
        }

        return chessMoved;
    }

    moveToTop() {
        let chessMoved = false;

        for (let i = 0; i < this.#size; i++) {
            let numIndex = 0;
            for (let j = 1; j < this.#size; j++) {
                let curChess = this.chessList[numIndex][i];
                let nextChess = this.chessList[j][i];

                if (curChess.num !== 0 && nextChess.num !== 0) {
                    if (curChess.num === nextChess.num) {
                        curChess.num *= 2;
                        nextChess.num = 0;
                        chessMoved = true;
                        this.chessInfo.move.set([i, j], [numIndex, i]);
                    } else if (numIndex + 1 !== j) {
                        this.chessList[numIndex + 1][i].num = nextChess.num;
                        nextChess.num = 0;
                        chessMoved = true;
                        this.chessInfo.move.set([i, j], [numIndex + 1, i]);
                    }
                    numIndex++;
                    continue;
                }

                if (nextChess.num !== 0) {
                    curChess.num = nextChess.num;
                    nextChess.num = 0;
                    chessMoved = true;
                    this.chessInfo.move.set([i, j], [numIndex, i]);
                }
            }
        }

        return chessMoved;
    }

    moveToBottom() {
        let chessMoved = false;

        for (let i = 0; i < this.#size; i++) {
            let numIndex = this.#size - 1;
            for (let j = this.#size - 2; j >= 0; j--) {
                let curChess = this.chessList[numIndex][i];
                let nextChess = this.chessList[j][i];

                if (curChess.num !== 0 && nextChess.num !== 0) {
                    if (curChess.num === nextChess.num) {
                        curChess.num *= 2;
                        nextChess.num = 0;
                        chessMoved = true;
                        this.chessInfo.move.set([i, j], [numIndex, i]);
                    } else if (numIndex - 1 !== j) {
                        this.chessList[numIndex - 1][i].num = nextChess.num;
                        nextChess.num = 0;
                        chessMoved = true;
                        this.chessInfo.move.set([i, j], [numIndex - 1, i]);
                    }
                    numIndex--;
                    continue;
                }

                if (nextChess.num !== 0) {
                    curChess.num = nextChess.num;
                    nextChess.num = 0;
                    chessMoved = true;
                    this.chessInfo.move.set([i, j], [numIndex, i]);
                }
            }
        }

        return chessMoved;
    }

    validateChessboardIsFull() {
        this.isFull = false;
        const newChessLoc = this.calcNewChessLoc();

        //without free space
        if (newChessLoc === null) {
            //validate adjacent elements have the same number
            for (let i = 0; i < this.#size; i++) {
                for (let j = 0; j < this.#size - 1; j++) {
                    if (this.chessList[i][j].num === this.chessList[i][j + 1].num) {
                        return;
                    }

                    if (this.chessList[j][i].num === this.chessList[j + 1][i].num) {
                        return;
                    }
                }
            }

            this.isFull = true;
        }
    }

    hasChess(x, y) {
        return this.chessList[x][y].num !== 0;
    }
}

class MathUtil {
    static getRandomNum(range) {
        return Math.floor(Math.random() * range);
    }
}