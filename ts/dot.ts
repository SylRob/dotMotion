class Dot {

    public r:number;
    private x:number;
    private y:number;
    private color:string;
    private ctx:CanvasRenderingContext2D;

    constructor( ctx:CanvasRenderingContext2D, r:number, x:number, y:number, color:string ) {

        this.r = r;
        this.x = x;
        this.y = y;
        this.color = color;
        this.ctx = ctx;

    }

    public display() {

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc( this.x, this.y, this.r, 0, 2*Math.PI );
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.restore();
    }

    public moveTo( r:number, x:number, y:number ) {

        this.r = r;
        this.x = x;
        this.y = y;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc( this.x, this.y, this.r, 0, 2*Math.PI );
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.restore();

    }

}
