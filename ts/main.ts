class MainController {

    private canvasElem: HTMLCanvasElement;
    private canvasWrapper: HTMLElement;
    private canvasCtx:CanvasRenderingContext2D;
    private currentIteration:number;
    public  animationTime:number = 1000;
    private totalIteration:number = (this.animationTime/1000) * 60;

    private dotsDataList = [
        { type: 'circle', s: 12, x: 120, y: 130, color: '#00dad7', x2: 700, y2: 380, cf: 0 },
        { type: 'circle', s: 12, x: 240, y: 220, color: '#15da00', x2: 740, y2: 380, cf: 0 },
        { type: 'circle', s: 12, x: 580, y: 550, color: '#da6100', x2: 660, y2: 380, cf: 0 },
        { type: 'circle', s: 12, x: 800, y: 280, color: '#c800da', x2: 620, y2: 380, cf: 0 }
    ];

    private dotsObjectList:Array<Dot>;
    private pathsObjectList:Array<Path>;

    constructor( idName:string ) {
        this.initCanvas( idName );
        this.initDotsAndPaths();
    }

    private initCanvas( idName:string ) {

        this.canvasElem = document.createElement( 'canvas' );
        this.canvasWrapper = document.getElementById( idName );
        this.canvasWrapper.appendChild( this.canvasElem );
        this.canvasElem.width = this.canvasWrapper.offsetWidth;
        this.canvasElem.height = this.canvasWrapper.offsetWidth;
        this.canvasCtx = this.canvasElem.getContext('2d');
    }

    private initDotsAndPaths() {

        this.dotsObjectList = [];
        this.pathsObjectList = [];
        this.canvasCtx.clearRect( 0, 0, this.canvasElem.width, this.canvasElem.height );

        for( var i = 0; i < this.dotsDataList.length; i++ ) {
            var data = this.dotsDataList[i];

            var dot = new Dot( this.canvasCtx, data.s, data.x, data.y, data.color );
            dot.display();
            this.dotsObjectList.push( dot );

            var path = new Path( data.x, data.y, data.x2, data.y2 );

            this.pathsObjectList.push( path );
        }
    }

    public animate() {

        this.currentIteration = 0;
        this.generateLoop();
        this.toDraw();
    }

    private generateLoop() {

        for( var i = 0; i < this.pathsObjectList.length; i++ ) {
            var path = this.pathsObjectList[i];
            path.generateLoop();
        }
    }

    private toDraw() {

        var pour = this.currentIteration / this.totalIteration;

        this.canvasCtx.clearRect( 0, 0, this.canvasElem.width, this.canvasElem.height );
        for( var i = 0; i < this.pathsObjectList.length; i++ ) {
            var path = this.pathsObjectList[i];
            var dot = this.dotsObjectList[i];

            //var distance = path.l * pour;
            var distance = this.easeOutCubic( this.currentIteration, 0, path.l, this.totalIteration );

            var p = path.getPoint( distance );
            dot.moveTo( dot.r ,p.x, p.y )
        }

        //finish
        if( pour >= 1 ) {

            return false;
        }

        this.currentIteration += 1;
        requestAnimationFrame( this.toDraw.bind(this) );
    }

    private easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
    }

    private myEasing(t:number, b:number, c:number, d:number):number {
    	var ts:number=(t/=d)*t;
    	var tc:number=ts*t;
    	return b+c*(0.84748*tc*ts + -3.9425*ts*ts + 0.79498*tc + 2.9*ts + 0.4*t);
    }

}

window.onload = function() {
    var c = new MainController( 'mainWrapper' );
    document.querySelector('#mainWrapper .loading').remove();

    setTimeout( ()=>{ c.animate(); }, 1000 );
}
