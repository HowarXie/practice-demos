const canvasEle = document.getElementById("canvasView");
const canvasCtx = canvasEle.getContext("2d");

const startPoint = [20, 100];
const controllPoints = [[50, 30], [80, 150]];
const endPoint = [100, 120];
const allPoints = [startPoint, ...controllPoints, endPoint];

drawBeizer(allPoints);

function drawBeizer(points) {
    if (points.length < 2) return;

    this.drawControlLine(points);

    canvasCtx.beginPath();
    canvasCtx.setLineDash([]);
    canvasCtx.strokeStyle = "black";
    canvasCtx.moveTo(points[0][0], points[0][1]);
    for (let i = 0; i <= 1; i += (1 / 1000)) {
        drawBeizerLine(points, i);
    }
    canvasCtx.stroke();
}

function drawControlLine(points) {
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = "red";
    canvasCtx.setLineDash([2, 2]);
    canvasCtx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        canvasCtx.lineTo(points[i][0], points[i][1]);
    }
    canvasCtx.stroke();
}

function drawBeizerLine(points, t) {
    const insertPoints = [];

    if (points.length === 1) {
        const [x, y] = points[0];
        canvasCtx.lineTo(x, y);
        return;
    }

    for (let i = 0; i < points.length - 1; i++) {
        const x = points[i][0] + t * (points[i + 1][0] - points[i][0]);
        const y = points[i][1] + t * (points[i + 1][1] - points[i][1]);

        insertPoints.push([x, y]);
    }

    drawBeizerLine(insertPoints, t);
}
