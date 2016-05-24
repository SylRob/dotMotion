var Dot = (function () {
    function Dot(ctx, r, x, y, color) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.color = color;
        this.ctx = ctx;
    }
    Dot.prototype.display = function () {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.restore();
    };
    Dot.prototype.moveTo = function (r, x, y) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.restore();
    };
    return Dot;
}());
