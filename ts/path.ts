declare var Bezier: any;

class Path {

    public x1:number;
    public y1:number;
    public startPointX:number;
    public startPointY:number;
    public cx1:number;
    public cy1:number;
    public cx2:number;
    public cy2:number;
    public perpandX:number;
    public perpandY:number;
    public cx3:number;
    public cy3:number;
    public cx4:number;
    public cy4:number;
    public endPointX:number;
    public endPointY:number;
    public x2:number;
    public y2:number;
    public coefLoop = 80;
    private m:number;
    private p:number;
    public l:number;

    private curve01:any;
    private curve02:any;

    private lengthBeforCurve:number;
    private lengthAfterCurve:number;
    private lengthOfCurve01:number;
    private lengthOfCurve02:number;

    constructor( x1, y1, x2, y2 ) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.setString();
    }

    private setString() {

        this.m = (this.y2 - this.y1) / (this.x2 - this.x1);
        this.p =  (this.m*-1)*this.x1 + this.y1;

        this.setL();
    }

    private setL() {
        this.l = Math.round( Math.sqrt(  Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1, 2)  ) );
    }

    private getLenght() {
        return this.l;
    }

    public generateLoop() {

        this.startPointX = this.x1;
        this.startPointY = this.y1;
        this.endPointX = this.x2;
        this.endPointY = this.y2;

        var segCenter = {
            x: (this.startPointX + this.endPointX)/2,
            y: (this.startPointY + this.endPointY)/2
        }

        // pente de la droite perpandiculaire m2 = -1/m1
        // y = m2X + p2
        // p2 = y - m2X
        //
        var m2 = -1/this.m;
        var p2 = segCenter.y - m2 * segCenter.x;

        var perpandX0 = 0;
        var perpandY0 = p2;

        var depX = segCenter.x;
        var depY = segCenter.y - perpandY0;

        var l2 = Math.round( Math.sqrt(  Math.pow(segCenter.x-perpandX0, 2) + Math.pow(segCenter.y-perpandY0, 2)  ) );

        this.perpandX = segCenter.x + (this.l/l2)*depX;
        this.perpandY = segCenter.y + (this.l/l2)*depY;

        this.cx1 = this.endPointX;
        this.cy1 = this.endPointY;


        var m3 = -1/this.m;
        var p3 = this.endPointY - m3 * this.endPointX;
        var bez02X0 = 0;
        var bez02Y0 = p3;
        var l3 = Math.round( Math.sqrt(  Math.pow(this.endPointX-bez02X0, 2) + Math.pow(this.endPointY-bez02Y0, 2)  ) );
        var bez02depX = this.endPointX;
        var bez02depY = this.endPointY - bez02Y0;

        this.cx2 = this.endPointX + (this.l/l3)*bez02depX;
        this.cy2 = this.endPointY + (this.l/l3)*bez02depY;


        var m4 = -1/this.m;
        var p4 = this.startPointY - m4 * this.startPointX;
        var bez03X0 = 0;
        var bez03Y0 = p4;
        var l4 = Math.round( Math.sqrt(  Math.pow(this.startPointX-bez03X0, 2) + Math.pow(this.startPointY-bez03Y0, 2)  ) );
        var bez03depX = this.startPointX;
        var bez03depY = this.startPointY - bez03Y0;

        this.cx3 = this.startPointX + (this.l/l4)*bez03depX;
        this.cy3 = this.startPointY + (this.l/l4)*bez03depY;

        this.cx4 = this.startPointX;
        this.cy4 = this.startPointY;

        this.curve01 = new Bezier( this.startPointX,this.startPointY , this.cx1,this.cy1 , this.cx2,this.cy2, this.perpandX,this.perpandY );
        this.curve02 = new Bezier( this.perpandX,this.perpandY , this.cx3,this.cy3 , this.cx4,this.cy4, this.endPointX,this.endPointY );

        var curvPathL = Math.round( Math.sqrt(  Math.pow(this.endPointX-this.startPointX, 2) + Math.pow(this.endPointY-this.startPointY, 2)  ) );

        //new length of the path
        this.l = Math.round( (this.l - curvPathL) + this.curve01.length() + this.curve02.length() );

        this.lengthBeforCurve = Math.round( Math.sqrt(  Math.pow(this.startPointX-this.x1, 2) + Math.pow(this.startPointY-this.y1, 2)  ) );
        this.lengthOfCurve01 = Math.round( this.curve01.length() );
        this.lengthOfCurve02 = Math.round( this.curve02.length() );
        this.lengthAfterCurve = Math.round( this.l - this.lengthBeforCurve - this.lengthOfCurve01 - this.lengthOfCurve02 );

    }

    /**
    *
    *   get a point coordinates with
    *   a distance
    *   -> Px( x1 + fraction of the distance * Xacroissement )
    *
    **/
    public getPoint( distance:number ) {

        if( distance <= this.lengthBeforCurve ) {
            var depX = this.x2 - this.x1;
            var depY = this.y2 - this.y1;

            return {
                x: this.x1 + (distance/this.l)*depX,
                y: this.y1 + (distance/this.l)*depY
            }
        } else if( distance > this.lengthBeforCurve && distance <= this.lengthBeforCurve + this.lengthOfCurve01 + this.lengthOfCurve02 ) {

            return this.getBezierPoint( distance );

        } else if( distance <= this.l ) {

            var depX = this.x2 - this.x1;
            var depY = this.y2 - this.y1;

            return {
                x: this.x1 + (distance/this.l)*depX,
                y: this.y1 + (distance/this.l)*depY
            }

        }
    }

    public getBezierPoint( distance:number ) {

        if( distance <= this.lengthBeforCurve + this.lengthOfCurve01 ) {
            var curvDist = distance - this.lengthBeforCurve;
            var p = (curvDist / this.lengthOfCurve01);
            var points = this.curve01.get( p );

        } else {
            var curvDist = distance - (this.lengthBeforCurve + this.lengthOfCurve01);
            var p = (curvDist / this.lengthOfCurve02);
            var points = this.curve02.get( p );
        }

        return points;

    }

}
