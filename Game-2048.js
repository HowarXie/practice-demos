const canvasEle = document.getElementById("canvas");
const context = canvasEle.getContext("2d");
const { width, height } = canvasEle;

class Game2048Renderer {
    constructor(ctx, chessboard) {
        this.ctx = ctx;
        this.chessboard = chessboard;
        this.imageData;
        this.initOptions();
    }

    initOptions() {
        //size
        this.chessSize = 60;
        this.gap = 5;
        this.chessContentSize = this.chessSize - this.gap * 2;
        this.boardSize = this.chessSize * this.chessboard.size + this.gap * 2;
        this.x = (width - this.boardSize) / 2;
        this.y = (height - this.boardSize) / 2;
        this.fontSize = 20;
        //annimation
        this.animationTime = 240;
        this.stepTime = 20;
    }

    start() {
        this.chessboard.start();
        this.draw();
    }

    //public
    draw() {
        this.clear();
        this.drawChessBoard();
        this.drawBgRects();
        this.drawFixedChesses();
        this.save();
        this.drawMovedChesses(0);
        this.drawGenerateChess(0);
    }

    clear() {
        this.ctx.clearRect(0, 0, width, height);
    }

    save() {
        this.imageData = this.ctx.getImageData(0, 0, width, height);
    }

    restore() {
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    drawChessBoard() {
        this.ctx.save();
        this.ctx.strokeStyle = "#d6d6d6";
        this.ctx.shadowBlur = this.gap;
        this.ctx.shadowColor = "#e8e8e8";
        CanvasUtil.drawRoundedRect(this.ctx, this.x, this.y, this.boardSize, this.boardSize, this.gap);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawBgRects() {
        for (let i = 0; i < this.chessboard.size; i++) {
            for (let j = 0; j < this.chessboard.size; j++) {
                this.drawBgRect(...this.getChessLoc(i, j));
            }
        }
    }

    getChessLoc(i, j) {
        const locX = this.x + this.gap * 2 + j * this.chessSize;
        const LocY = this.y + this.gap * 2 + i * this.chessSize;

        return [locX, LocY];
    }

    drawBgRect(x, y) {
        this.ctx.save();
        this.ctx.fillStyle = "#d6d6d6";
        this.ctx.fillRect(x, y, this.chessContentSize, this.chessContentSize);
        this.ctx.restore();
    }

    drawFixedChesses() {
        const fixedChesses = this.getFixedChessed();

        fixedChesses.forEach(loc => {
            this.drawChess(...this.getChessLoc(...loc), this.chessContentSize, this.chessboard.getOldChessByLoc(...loc));
        })
    }

    getFixedChessed() {
        const movedChesses = [];
        const fixedChesses = [];

        this.chessboard.chessInfo.move.forEach((end, start) => {
            movedChesses.push(start);
        })

        if (this.chessboard.chessInfo.generate.length > 0)
            movedChesses.push(this.chessboard.chessInfo.generate);

        for (let i = 0; i < this.chessboard.size; i++) {
            for (let j = 0; j < this.chessboard.size; j++) {
                if (this.chessboard.getOldChessByLoc(i, j).num && movedChesses.findIndex(chess => chess[0] === i && chess[1] === j) === -1)
                    fixedChesses.push([i, j]);
            }
        }

        return fixedChesses;
    }

    drawMovedChesses(t) {
        if (t > this.animationTime) return;
        if (this.chessboard.chessInfo.move.size === 0) return;

        this.restore();
        this.chessboard.chessInfo.move.forEach((end, start) => {
            const distance = [start[0] - end[0], start[1] - end[1]];
            const [startChessX, startChessY] = this.getChessLoc(...start);
            const currentX = startChessX - distance[1] * this.chessSize * t / this.animationTime;
            const currentY = startChessY - distance[0] * this.chessSize * t / this.animationTime;
            const chess = t === this.animationTime ? this.chessboard.getChessByLoc(...end) : this.chessboard.getOldChessByLoc(...start);

            this.ctx.save();
            this.ctx.globalAlpha = t === 0 || t === this.animationTime ? 1 : 0.8;
            this.drawChess(currentX, currentY, this.chessContentSize, chess);
            this.ctx.restore();
        })
        t += this.stepTime;
        window.requestAnimationFrame(this.drawMovedChesses.bind(this, t));
    }

    drawGenerateChess(t) {
        if (t > this.animationTime) return;
        if (this.chessboard.chessInfo.generate.length === 0) return;

        const [locX, locY] = this.getChessLoc(...this.chessboard.chessInfo.generate);
        const chess = this.chessboard.getChessByLoc(...this.chessboard.chessInfo.generate);
        const scale = t / this.animationTime;
        const size = this.chessContentSize * scale;
        const translate = (this.chessContentSize - size) / 2;

        this.ctx.save();
        this.ctx.clearRect(locX, locY, this.chessContentSize, this.chessContentSize);
        this.drawBgRect(locX, locY);
        this.ctx.globalAlpha = t === this.animationTime ? 1 : 0.8;
        this.ctx.translate(translate, translate);
        this.drawChess(locX, locY, size, chess, scale);
        this.ctx.restore();

        t += this.stepTime;
        window.requestAnimationFrame(this.drawGenerateChess.bind(this, t));
    }

    drawChess(x, y, size, chess, scale = 1) {
        this.ctx.save();
        this.ctx.fillStyle = chess.color;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.shadowColor = "#b2b2b2";
        this.ctx.fillRect(x, y, size, size);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.font = `${this.fontSize * scale}px serif`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(chess.num, x + size / 2, y + size / 2);
        this.ctx.restore();
    }
}

class CanvasUtil {
    static drawRoundedRect(ctx, x, y, width, height, radiaus) {
        ctx.beginPath();
        ctx.moveTo(x, y + radiaus);
        ctx.quadraticCurveTo(x, y, x + radiaus, y);
        ctx.lineTo(x + width - radiaus, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radiaus);
        ctx.lineTo(x + width, y + height - radiaus);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radiaus, y + height);
        ctx.lineTo(x + radiaus, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radiaus);
        ctx.lineTo(x, y + radiaus);
        ctx.closePath();
    }
}

//--------------------------test---------------------------------
const chessboard = new Chessboard(4);
const renderer = new Game2048Renderer(context, chessboard);
renderer.start();

document.body.addEventListener("keydown", function (ev) {
    switch (ev.key) {
        case "ArrowUp":
        case "w": renderer.chessboard.moveTo(Direction.up); break;
        case "ArrowLeft":
        case "a": renderer.chessboard.moveTo(Direction.left); break;
        case "ArrowDown":
        case "s": renderer.chessboard.moveTo(Direction.down); break;
        case "ArrowRight":
        case "d": renderer.chessboard.moveTo(Direction.right); break;
    }

    if (renderer.chessboard.isFull) {
        const replay = window.confirm("Game Over! Play again?");
        if (replay)
            renderer.start();
    } else {
        renderer.draw();
    }
});