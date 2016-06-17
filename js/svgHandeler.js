var SvgHandeler = (function () {
    function SvgHandeler() {
    }
    SvgHandeler.prototype.load = function (svgPath) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        return new Promise(function (resolve, reject) {
            xhr.addEventListener("load", function () {
                _this.svgObj = xhr.responseXML.documentElement;
                _this.getPointList();
                resolve();
            });
            xhr.open("GET", svgPath, false);
            xhr.overrideMimeType("image/svg+xml");
            xhr.send("");
        });
    };
    SvgHandeler.prototype.getPointList = function () {
        this.points = {};
        var paths = this.svgObj.querySelectorAll('path');
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var dPath = path.getAttribute('d');
            var pointsArray = this.parsePath(path);
            var l = pointsArray.length;
            var num = [pointsArray[0][1], pointsArray[0][2]];
            var pointList = [];
            for (var j = 0; j <= l - 1; j++) {
                var point = pointsArray[j];
                switch (point[0]) {
                    case 'M':
                        pointList.push([point[1], point[2]]);
                        break;
                    case 'Z':
                    case 'z':
                        break;
                    case point[0].toUpperCase():
                        if (point[0] == 'C') {
                            pointList.push([
                                Math.round(point[5]),
                                Math.round(point[6])
                            ]);
                        }
                        else if (point[0] == 'H') {
                            pointList.push([
                                Math.round(point[1]),
                                pointList[pointList.length - 1][1]
                            ]);
                        }
                        else if (point[0] == 'V') {
                            pointList.push([
                                pointList[pointList.length - 1][0],
                                Math.round(point[1])
                            ]);
                        }
                        else {
                            pointList.push([
                                Math.round(point[1]),
                                Math.round(point[2])
                            ]);
                        }
                        break;
                    case point[0].toLowerCase():
                        if (point[0] == 'c') {
                            pointList.push([
                                Math.round(pointList[pointList.length - 1][0] + point[5]),
                                Math.round(pointList[pointList.length - 1][1] + point[6])
                            ]);
                        }
                        else if (point[0] == 'h') {
                            pointList.push([
                                Math.round(pointList[pointList.length - 1][0] + point[1]),
                                pointList[pointList.length - 1][1]
                            ]);
                        }
                        else if (point[0] == 'v') {
                            pointList.push([
                                pointList[pointList.length - 1][0],
                                Math.round(pointList[pointList.length - 1][1] + point[1])
                            ]);
                        }
                        else {
                            pointList.push([
                                Math.round(pointList[pointList.length - 1][0] + point[1]),
                                Math.round(pointList[pointList.length - 1][1] + point[2])
                            ]);
                        }
                        break;
                    default:
                        console.log('didnt catch this one', point);
                        break;
                }
            }
            this.points[path.getAttribute('id')] = {
                pointsList: pointList,
                pathString: dPath
            };
        }
    };
    SvgHandeler.prototype.parsePath = function (path) {
        var length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };
        var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
        function parse(path) {
            var data = [];
            path.replace(segment, function (_, command, args) {
                var type = command.toLowerCase();
                args = parseValues(args);
                if (type == 'm' && args.length > 2) {
                    data.push([command].concat(args.splice(0, 2)));
                    type = 'l';
                    command = command == 'm' ? 'l' : 'L';
                }
                while (true) {
                    if (args.length == length[type]) {
                        args.unshift(command);
                        return data.push(args);
                    }
                    if (args.length < length[type])
                        throw new Error('malformed path data');
                    data.push([command].concat(args.splice(0, length[type])));
                }
            });
            return data;
        }
        function parseValues(args) {
            args = args.match(/-?[.0-9]+(?:e[-+]?\d+)?/ig);
            return args ? args.map(Number) : [];
        }
        return parse(path.getAttribute('d'));
    };
    SvgHandeler.prototype.listPointProportional = function (proportional) {
        var newPointsList = [];
        for (var letter in this.points) {
            var points = this.points[letter].pointsList;
            var l = points.length;
            for (var i = 0; i < l - 1; i++)
                newPointsList.push(points[i]);
        }
        return newPointsList;
    };
    return SvgHandeler;
}());
