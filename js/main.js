var MainController = (function () {
    function MainController(idName) {
        this.animationTime = 1000;
        this.totalIteration = (this.animationTime / 1000) * 60;
        this.dotsDataList = [
            { type: 'circle', s: 12, x: 120, y: 130, color: '#00dad7', x2: 700, y2: 380, cf: 0 },
            { type: 'circle', s: 12, x: 240, y: 220, color: '#15da00', x2: 740, y2: 380, cf: 0 },
            { type: 'circle', s: 12, x: 580, y: 550, color: '#da6100', x2: 660, y2: 380, cf: 0 },
            { type: 'circle', s: 12, x: 800, y: 280, color: '#c800da', x2: 620, y2: 380, cf: 0 }
        ];
        this.initCanvas(idName);
        this.initDotsAndPaths();
    }
    MainController.prototype.initCanvas = function (idName) {
        this.canvasElem = document.createElement('canvas');
        this.canvasWrapper = document.getElementById(idName);
        this.canvasWrapper.appendChild(this.canvasElem);
        this.canvasElem.width = this.canvasWrapper.offsetWidth;
        this.canvasElem.height = this.canvasWrapper.offsetWidth;
        this.canvasCtx = this.canvasElem.getContext('2d');
    };
    MainController.prototype.initDotsAndPaths = function () {
        this.dotsObjectList = [];
        this.pathsObjectList = [];
        this.canvasCtx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        for (var i = 0; i < this.dotsDataList.length; i++) {
            var data = this.dotsDataList[i];
            var dot = new Dot(this.canvasCtx, data.s, data.x, data.y, data.color);
            dot.display();
            this.dotsObjectList.push(dot);
            var path = new Path(data.x, data.y, data.x2, data.y2);
            this.pathsObjectList.push(path);
        }
    };
    MainController.prototype.animate = function () {
        this.currentIteration = 0;
        this.generateLoop();
        this.toDraw();
    };
    MainController.prototype.generateLoop = function () {
        for (var i = 0; i < this.pathsObjectList.length; i++) {
            var path = this.pathsObjectList[i];
            path.generateLoop();
        }
    };
    MainController.prototype.toDraw = function () {
        var pour = this.currentIteration / this.totalIteration;
        this.canvasCtx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        for (var i = 0; i < this.pathsObjectList.length; i++) {
            var path = this.pathsObjectList[i];
            var dot = this.dotsObjectList[i];
            var distance = this.easeOutCubic(this.currentIteration, 0, path.l, this.totalIteration);
            var p = path.getPoint(distance);
            dot.moveTo(dot.r, p.x, p.y);
        }
        if (pour >= 1) {
            return false;
        }
        this.currentIteration += 1;
        requestAnimationFrame(this.toDraw.bind(this));
    };
    MainController.prototype.easeOutCubic = function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
    };
    MainController.prototype.myEasing = function (t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (0.84748 * tc * ts + -3.9425 * ts * ts + 0.79498 * tc + 2.9 * ts + 0.4 * t);
    };
    return MainController;
}());
window.onload = function () {
    var c = new MainController('mainWrapper');
    document.querySelector('#mainWrapper .loading').remove();
    setTimeout(function () { c.animate(); }, 1000);
};
