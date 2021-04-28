const startPoint = [20, 200];
const controlPoints = [[50, 30]];
const endPoint = [300, 200];
const allPoints = [startPoint, ...controlPoints, endPoint];

class BezierRenderer {
    #pointRadius = 2;

    constructor(canvasEle, initPoints) {
        this.canvasEle = canvasEle;
        this.canvasCtx = canvasEle.getContext("2d", { alpha: false });

        this.initPoints = [...initPoints];
        this.snapshotPoints = [...initPoints];
        this.selectedPointIndex = -1;
        this.bindEvents();
    }

    draw() {
        if (this.snapshotPoints.length < 2) return;

        this.clear();
        this.drawControlLine();
        this.drawPoints();
        this.drawBezier();
    }

    clear() {
        const { width, height } = this.canvasEle.getBoundingClientRect();
        this.canvasCtx.clearRect(0, 0, width, height);
    }

    drawControlLine() {
        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = "red";
        this.canvasCtx.setLineDash([2, 2]);
        this.canvasCtx.moveTo(this.snapshotPoints[0][0], this.snapshotPoints[0][1]);
        for (let i = 1; i < this.snapshotPoints.length; i++) {
            this.canvasCtx.lineTo(this.snapshotPoints[i][0], this.snapshotPoints[i][1]);
        }
        this.canvasCtx.stroke();
        this.canvasCtx.closePath();
    }

    drawPoints() {
        this.canvasCtx.setLineDash([]);
        this.snapshotPoints.forEach(this.drawPoint);
    }

    drawPoint(point, index) {
        this.canvasCtx.beginPath();

        if (index === 0 || index === this.snapshotPoints.length - 1) {
            this.canvasCtx.fillStyle = "#000";
        } else {
            this.canvasCtx.fillStyle = "blue";
        }

        if (index === this.selectedPointIndex) {
            this.drawPointWrapper(index);
        }

        const [x, y] = point;
        this.canvasCtx.moveTo(x + this.#pointRadius, y);
        this.canvasCtx.arc(x, y, this.#pointRadius, 0, Math.PI * 2, true);
        this.canvasCtx.fill();
        this.canvasCtx.closePath();
    }

    drawBezier() {
        const pointsCount = 1000;
        this.canvasCtx.beginPath();
        this.canvasCtx.setLineDash([]);
        this.canvasCtx.strokeStyle = "black";
        this.canvasCtx.moveTo(this.snapshotPoints[0][0], this.snapshotPoints[0][1]);
        for (let i = 0; i <= 1; i += (1 / pointsCount)) {
            this.drawBezierLine(this.snapshotPoints, i);
        }
        this.canvasCtx.stroke();
        this.canvasCtx.closePath();
    }

    drawBezierLine(points, t) {
        const insertPoints = [];

        if (points.length === 1) {
            const [x, y] = points[0];
            this.canvasCtx.lineTo(x, y);
            return;
        }

        for (let i = 0; i < points.length - 1; i++) {
            const x = points[i][0] + t * (points[i + 1][0] - points[i][0]);
            const y = points[i][1] + t * (points[i + 1][1] - points[i][1]);

            insertPoints.push([x, y]);
        }

        this.drawBezierLine(insertPoints, t);
    }

    drawPointWrapper(index) {
        if (index > -1) {
            if (index === 0 || index === this.snapshotPoints.length - 1) {
                this.canvasCtx.strokeStyle = "#000";
            } else {
                this.canvasCtx.strokeStyle = "blue";
            }

            const selectedPoint = this.snapshotPoints[index];
            const [x, y] = selectedPoint;
            const r = this.#pointRadius;

            this.canvasCtx.strokeRect(x - r, y - r, r * 2, r * 2);
        }
    }

    clearPonitWarpper(index) {
        if (index > -1) {
            const selectedPoint = this.snapshotPoints[index];
            const [x, y] = selectedPoint;
            const r = this.#pointRadius;
            const gap = this.canvasCtx.lineWidth + 0.5;

            this.canvasCtx.clearRect(x - r - gap, y - r - gap, (r + gap) * 2, (r + gap) * 2);
            this.drawPoint(selectedPoint, index);
        }
    }
    //#region events
    bindEvents() {
        this.draw = this.draw.bind(this);
        this.drawPoint = this.drawPoint.bind(this);
        this.mousedownHandler = this.mousedownHandler.bind(this);
        this.mousemoveHandler = this.mousemoveHandler.bind(this);
        this.mouseupHandler = this.mouseupHandler.bind(this);

        this.canvasEle.addEventListener("mousedown", this.mousedownHandler);
        this.canvasEle.addEventListener("mousemove", this.mousemoveHandler);
        this.canvasEle.addEventListener("mouseup", this.mouseupHandler);
    }

    mousedownHandler(ev) {
        const { offsetX, offsetY } = ev;
        this.selectedPointIndex = this.snapshotPoints.findIndex(point => this.isInPoint(offsetX, offsetY, point));
        this.drawPointWrapper(this.selectedPointIndex);
    }

    mousemoveHandler(ev) {
        if (this.selectedPointIndex > -1) {
            let selectedPoint = this.snapshotPoints[this.selectedPointIndex];
            const { offsetX, offsetY } = ev;

            selectedPoint = [offsetX, offsetY];
            this.snapshotPoints[this.selectedPointIndex] = selectedPoint;

            window.requestAnimationFrame(this.draw);
        }
    }

    mouseupHandler(ev) {
        const preselectedPointIndex = this.selectedPointIndex;
        this.selectedPointIndex = -1;
        this.clearPonitWarpper(preselectedPointIndex);
    }

    isInPoint(offsetX, offsetY, point) {
        const [x, y] = point;

        if (offsetX >= x - this.#pointRadius && offsetX <= x + this.#pointRadius && offsetY >= y - this.#pointRadius && offsetY <= y + this.#pointRadius) {
            return true;
        }

        return false;
    }
    //#endregion
}

const bezierRenderer = new BezierRenderer(canvasEle, allPoints);
bezierRenderer.draw();