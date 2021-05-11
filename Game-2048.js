const canvasEle = document.getElementById("canvas");
const { width, height } = canvasEle;
const context = canvasEle.getContext("2d");

const size = 4;
const chessboard = new Chessboard(size);

const chessSize = 60;
const chessContentSize = 50;
const gap = 5;

const boardSize = chessSize * size + gap * 2;
const x = (width - boardSize) / 2;
const y = (height - boardSize) / 2;

const animationTime = 250; //250ms

function draw(ctx, chessboard) {
    const offscreenCanvas = getBgCanvas(chessboard);
    ctx.drawImage(offscreenCanvas, x, y);
}

function getBgCanvas(chessboard) {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = boardSize;
    offscreenCanvas.height = boardSize;
    const offscreenCtx = offscreenCanvas.getContext("2d");
    drawChessBoard(offscreenCtx);
    drawChessesBg(offscreenCtx, chessboard);
    return offscreenCanvas;
}

function drawChessBoard(ctx) {
    ctx.save();
    ctx.strokeStyle = "#d6d6d6";
    ctx.shadowBlur = gap;
    ctx.shadowColor = "#e8e8e8";
    drawRoundedRect(ctx, 0, 0, boardSize, boardSize, gap);
    ctx.stroke();
    ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radiaus) {
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

function drawChessesBg(ctx, chessboard) {
    chessboard.chessList.forEach((chesses, row) => {
        chesses.forEach((chess, col) => {
            let chessX = gap + row * chessSize + gap;
            let chessY = gap + col * chessSize + gap;

            drawBgRect(ctx, chessX, chessY, chessContentSize);

            const movedChesses = Array.from(chessboard.chessInfo.move.keys());
            if (chess.num && movedChesses.findIndex(loc => loc[0] === row && loc[1] === col) === -1)
                drawChess(ctx, chessX, chessY, chessContentSize, chess.num);
        });
    });
}

function drawMoveChessTrack(ctx, chessboard, t) {
    chessboard.chessInfo.move.forEach((value, key) => {

    })
}

function drawBgRect(ctx, x, y, size) {
    ctx.save();
    ctx.fillStyle = "#d6d6d6";
    ctx.fillRect(x, y, size, size);
    ctx.restore();
}

function drawChess(ctx, x, y, size, txt) {
    ctx.save();
    ctx.fillStyle = "#98F5FF";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "#b2b2b2";
    ctx.fillRect(x, y, size, size);
    ctx.restore();

    ctx.save();
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(txt, x + size / 2, y + size / 2);
    ctx.restore();
}

//-------test------------
draw(context, chessboard);

