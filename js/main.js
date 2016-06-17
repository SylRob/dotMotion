var MainController = (function () {
    function MainController(idName, animationTime) {
        this.currentIteration = 0;
        this.animationTime = 1000;
        this.initCanvas(idName);
        this.animationTime = animationTime || this.animationTime;
        this.totalIteration = (this.animationTime / 1000) * 60;
    }
    MainController.prototype.addDotsDataList = function (dotsDataList) {
        this.dotsDataList = dotsDataList;
        this.initDotsAndPaths();
    };
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
            data.animationFinished = false;
            this.setTiming(data);
            var dot = new Dot(this.canvasCtx, data.s, data.x, data.y, data.color);
            dot.display();
            this.dotsObjectList.push(dot);
            var path = new Path(data.x, data.y, data.x2, data.y2);
            this.pathsObjectList.push(path);
        }
    };
    MainController.prototype.setTiming = function (dataObj) {
        if (!dataObj.delay) {
            dataObj.delay = 0;
            dataObj.startIteration = 0;
            return false;
        }
        else if (!this.totalIteration)
            throw new Error('total iteration is not set yet');
        dataObj.startIteration = Math.round((dataObj.delay / 1000) * 60);
    };
    MainController.prototype.animate = function () {
        this.currentIteration = 0;
        this.generateLoop();
        this.toDraw();
    };
    MainController.prototype.generateLoop = function () {
        for (var i = 0; i < this.pathsObjectList.length; i++) {
            var path = this.pathsObjectList[i];
            path.generateLoop(this.dotsDataList[i].upsidown ? true : false);
        }
    };
    MainController.prototype.toDraw = function () {
        var finishedAnimations = 0;
        this.canvasCtx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        for (var i = 0; i < this.pathsObjectList.length; i++) {
            var path = this.pathsObjectList[i];
            var dot = this.dotsObjectList[i];
            var data = this.dotsDataList[i];
            if (data.animationFinished) {
                dot.moveTo(dot.r, data.x2, data.y2);
                continue;
            }
            ;
            var dotActualItteration = this.currentIteration - data.startIteration;
            var finalIteration = this.totalIteration + data.startIteration;
            var pour = dotActualItteration / finalIteration;
            var distance;
            if (this.currentIteration - data.startIteration < 0) {
                distance = 0;
            }
            else
                distance = this.easeOutCubic(dotActualItteration, 0, path.l, finalIteration);
            var p = path.getPoint(distance);
            if (typeof p == "undefined")
                continue;
            dot.moveTo(dot.r, p.x, p.y);
            if (pour >= 1) {
                data.animationFinished = true;
                finishedAnimations += 1;
                if (finishedAnimations == this.dotsDataList.length)
                    return false;
            }
        }
        this.currentIteration += 1;
        requestAnimationFrame(this.toDraw.bind(this));
    };
    MainController.prototype.easeOutCubic = function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
    };
    MainController.prototype.myEasing = function (currentIteration, startValue, changeInValue, totalIterations) {
        var ts = (currentIteration /= totalIterations) * currentIteration;
        var tc = ts * currentIteration;
        return startValue + changeInValue * (0.84748 * tc * ts + -3.9425 * ts * ts + 0.79498 * tc + 2.9 * ts + 0.4 * currentIteration);
    };
    return MainController;
}());
window.onload = function () {
    function generateRandom(max) {
        var arr = [];
        var colorArr = ['#00dad7', '#15da00', '#da6100', '#c800da', '#00dad7', '#15da00', '#da6100', '#c800da'];
        for (var i = 0; i < max; i++) {
            var obj = {
                type: 'circle',
                s: Math.random() * (24 - 12) + 12,
                x: Math.random() * 1400,
                y: Math.random() * 789,
                color: colorArr[Math.floor(Math.random() * colorArr.length)],
                x2: Math.random() * 1400,
                y2: 380,
                delay: Math.random() * 2600
            };
            arr.push(obj);
            i++;
        }
        return arr;
    }
    function generateFromList(pointList) {
        var arr = [];
        var colorArr = ['#00dad7', '#15da00', '#da6100', '#c800da', '#00dad7', '#15da00', '#da6100', '#c800da'];
        for (var f = 0; f < pointList.length; f++) {
            var obj = {
                type: 'circle',
                s: Math.random() * (6 - 3) + 3,
                x: Math.random() * 1400,
                y: Math.random() * 789,
                color: colorArr[Math.floor(Math.random() * colorArr.length)],
                x2: pointList[f][0] + 100,
                y2: pointList[f][1] + 200,
                delay: Math.random() * 2600
            };
            arr.push(obj);
        }
        return arr;
    }
    var c = new MainController('mainWrapper', 1000);
    var svgHandeler = new SvgHandeler();
    svgHandeler.load('img/PeaceInc.svg').then(function () {
        var pointsRaw = svgHandeler.listPointProportional(0);
        var points = generateFromList(pointsRaw);
        c.addDotsDataList(points);
        setTimeout(function () { c.animate(); }, 1000);
    });
};
