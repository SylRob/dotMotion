class MainController {

    private canvasElem: HTMLCanvasElement;
    private canvasWrapper: HTMLElement;
    private canvasCtx:CanvasRenderingContext2D;
    private currentIteration:number = 0;
    public  animationTime:number = 1000;
    private totalIteration:number;

    private dotsDataList:Array<any>;

    private dotsObjectList:Array<Dot>;
    private pathsObjectList:Array<Path>;

    constructor( idName:string, dotsDataList:Array<any>, animationTime:number ) {
        this.dotsDataList = dotsDataList;
        this.initCanvas( idName );

        this.animationTime = animationTime || this.animationTime;
        this.totalIteration = (this.animationTime/1000) * 60;
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

            data.animationFinished = false;
            this.setTiming( data );
            var dot = new Dot( this.canvasCtx, data.s, data.x, data.y, data.color );
            dot.display();
            this.dotsObjectList.push( dot );

            var path = new Path( data.x, data.y, data.x2, data.y2 );

            this.pathsObjectList.push( path );
        }
    }

    private setTiming( dataObj ) {
        if( !dataObj.delay ) {
            dataObj.delay = 0;
            dataObj.startIteration = 0;
            return false;
        }
        else if( !this.totalIteration ) throw new Error( 'total iteration is not set yet' );

        dataObj.startIteration = Math.round((dataObj.delay/1000) * 60);
    }

    public animate() {
        this.currentIteration = 0;
        this.generateLoop();
        this.toDraw();
    }

    private generateLoop() {

        for( var i = 0; i < this.pathsObjectList.length; i++ ) {
            var path = this.pathsObjectList[i];
            path.generateLoop( this.dotsDataList[i].upsidown ? true : false );
        }
    }

    private toDraw() {

        var finishedAnimations = 0;
        this.canvasCtx.clearRect( 0, 0, this.canvasElem.width, this.canvasElem.height );
        for( var i = 0; i < this.pathsObjectList.length; i++ ) {
            var path = this.pathsObjectList[i];
            var dot = this.dotsObjectList[i];
            var data = this.dotsDataList[i];

            if( data.animationFinished ) {
                dot.moveTo( dot.r ,data.x2, data.y2 );
                continue;
            };

            var dotActualItteration = this.currentIteration - data.startIteration;
            var finalIteration = this.totalIteration + data.startIteration;
            var pour = dotActualItteration / finalIteration;

            //var distance = path.l * pour;
            var distance;
            //no start because of the delay, so distance from the start -> 0
            if( this.currentIteration - data.startIteration < 0 ) {
                distance = 0;
            } else distance = this.easeOutCubic( dotActualItteration, 0, path.l, finalIteration );

            var p = path.getPoint( distance );
            dot.moveTo( dot.r ,p.x, p.y );

            if( pour >= 1 ) {
                data.animationFinished = true;
                finishedAnimations += 1;
                //is this the end ??
                if( finishedAnimations == this.dotsDataList.length ) return false;
            }
        }

        this.currentIteration += 1;
        requestAnimationFrame( this.toDraw.bind(this) );
    }

    private easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
    }

    private myEasing(currentIteration:number, startValue:number, changeInValue:number, totalIterations:number):number {
    	var ts:number=(currentIteration/=totalIterations)*currentIteration;
    	var tc:number=ts*currentIteration;
    	return startValue+changeInValue*(0.84748*tc*ts + -3.9425*ts*ts + 0.79498*tc + 2.9*ts + 0.4*currentIteration);
    }

}



window.onload = function() {


    function generateRandom( max:number ) {

        var arr = [];
        var colorArr = ['#00dad7', '#15da00', '#da6100', '#c800da', '#00dad7', '#15da00', '#da6100', '#c800da']

        for( var i = 0; i < max; i++ ) {
            var obj = {
                type: 'circle',
                s: Math.random() * (24 - 12) + 12,
                x: Math.random() * 1400,
                y: Math.random() * 789,
                color: colorArr[Math.floor(Math.random()*colorArr.length)],
                x2: Math.random() * 1400,
                y2: 380,
                delay: Math.random() * 2600
            }
            arr.push( obj );
            i++;
        }
        return arr;
    }


    /*var c = new MainController(
        'mainWrapper',
        [
            { type: 'circle', s: 12, x: 120, y: 130, color: '#00dad7', x2: 700, y2: 380, upsidown: true },
            { type: 'circle', s: 12, x: 240, y: 220, color: '#15da00', x2: 740, y2: 380, delay: 400 },
            { type: 'circle', s: 12, x: 580, y: 550, color: '#da6100', x2: 660, y2: 380, delay: 800 },
            { type: 'circle', s: 12, x: 850, y: 300, color: '#c800da', x2: 620, y2: 380, delay: 1200 },
            { type: 'circle', s: 14, x: 200, y: 80, color: '#00dad7', x2: 700, y2: 380, delay: 1600 },
            { type: 'circle', s: 18, x: 950, y: 50, color: '#15da00', x2: 740, y2: 380, delay: 2000 },
            { type: 'circle', s: 20, x: 1200, y: 700, color: '#da6100', x2: 660, y2: 380, delay: 2400 },
            { type: 'circle', s: 24, x: 20, y: 600, color: '#c800da', x2: 620, y2: 380, delay: 2600 }
        ],
        1000
    );*/
    var c = new MainController(
        'mainWrapper',
        generateRandom(1000),
        1000
    );
    document.querySelector('#mainWrapper .loading').remove();

    setTimeout( ()=>{ c.animate(); }, 1000 );
}
