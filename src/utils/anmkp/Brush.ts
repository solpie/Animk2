//  namespace Anmkp {
const PI = Math.PI;
const toRad = PI / 180;
const toDeg = 1 / toRad;
const min = Math.min;
const max = Math.max;
const abs = Math.abs;
const sin = Math.sin;
const cos = Math.cos;
const sqrt = Math.sqrt;
const atan2 = Math.atan2;
const ONE = PI + PI;
const QUARTER = PI * 0.5;
var random = Math.random;
export class Brush {
    // math shortcut

    setRandomFunction(value) {
        random = value;
    }
    clone() {
        // var clone = new Brush(context);
        // clone.setColor(this.getColor());
        // clone.setFlow(this.getFlow());
        // clone.setSize(this.getSize());
        // clone.setSpacing(this.getSpacing());
        // clone.setAngle(this.getAngle());
        // clone.setRotateToDirection(this.getRotateToDirection());
        // clone.setNormalSpread(this.getNormalSpread());
        // clone.setTangentSpread(this.getTangentSpread());
        // clone.setImage(this.getImage());
    }
    context = null;
    getContext() {
        return this.context;
    }
    setContext(value) {
        console.log('brush set Context',value)
        this.context = value;
    }
    color = '#000';
    getColor() {
        return this.color;
    }
    setColor(value) {
        this.color = value;
        this.transformedImageIsDirty = true;
    }
    flow = 1;
    getFlow() {
        return this.flow;
    }
    setFlow(value) {
        this.flow = value;
        this.transformedImageIsDirty = true;
    }

    size = 10;
    getSize() {
        return this.size;
    }
    setSize(value) {
        this.size = (value < 1) ? 1 : value;
        this.transformedImageIsDirty = true;
    }

    spacing = 0.2;
    getSpacing() {
        return this.spacing;
    }
    setSpacing(value) {
        this.spacing = (value < 0.01) ? 0.01 : value;
    }

    angle = 0; // radian unit
    getAngle() { // returns degree unit
        return this.angle * toDeg;
    }
    setAngle(value) {
        this.angle = value * toRad;
    }
    rotateToDirection = false;
    getRotateToDirection() {
        return this.rotateToDirection;
    }
    setRotateToDirection(value) {
        this.rotateToDirection = value;
    }
    normalSpread = 0;
    getNormalSpread() {
        return this.normalSpread;
    }
    setNormalSpread(value) {
        this.normalSpread = value;
    }
    tangentSpread = 0;
    getTangentSpread() {
        return this.tangentSpread;
    }
    setTangentSpread(value) {
        this.tangentSpread = value;
    }
    image = null;
    transformedImage = null;
    transformedImageIsDirty = true;
    imageRatio = 1;
    getImage() {
        return this.image;
    }
    setImage(value) {
        if (value == null) {
            this.transformedImage = this.image = null;
            this.imageRatio = 1;
            this.drawFunction = this.drawCircle;
        }
        else if (value != this.image) {
            this.image = value;
            this.imageRatio = this.image.height / this.image.width;
            this.transformedImage = document.createElement('canvas');
            this.drawFunction = this.drawImage;
            this.transformedImageIsDirty = true;
        }
    }

    delta = 0;
    prevX = 0;
    prevY = 0;
    lastX = 0;
    lastY = 0;
    dir = 0;
    prevScale = 0;
    drawFunction = this.drawCircle;
    reserved = null;
    dirtyRect;
    spreadRandom() {
        return random() - 0.5;
    }

    drawReserved() {
        if (this.reserved != null) {
            this.drawTo(this.reserved.x, this.reserved.y, this.reserved.scale);
            this.reserved = null;
        }
    }

    appendDirtyRect(x, y, width, height) {
        if (!(width && height))
            return;
        var dxw = this.dirtyRect.x + this.dirtyRect.width;
        var dyh = this.dirtyRect.y + this.dirtyRect.height;
        var xw = x + width;
        var yh = y + height;
        var minX = this.dirtyRect.width ? min(this.dirtyRect.x, x) : x;
        var minY = this.dirtyRect.height ? min(this.dirtyRect.y, y) : y;
        this.dirtyRect.x = minX;
        this.dirtyRect.y = minY;
        this.dirtyRect.width = max(dxw, xw) - minX;
        this.dirtyRect.height = max(dyh, yh) - minY;
    }

    transformImage() {
        this.transformedImage.width = this.size;
        this.transformedImage.height = this.size * this.imageRatio;
        var brushContext = this.transformedImage.getContext('2d');
        brushContext.clearRect(0, 0,
            this.transformedImage.width, this.transformedImage.height);
        brushContext.drawImage(this.image, 0, 0,
            this.transformedImage.width, this.transformedImage.height);
        brushContext.globalCompositeOperation = 'source-in';
        brushContext.fillStyle = this.color;
        brushContext.globalAlpha = this.flow;
        brushContext.fillRect(0, 0,
            this.transformedImage.width, this.transformedImage.height);
    }

    drawCircle(size) {
        var halfSize = size * 0.5;
        let context = this.context
        context.fillStyle = this.color;
        context.globalAlpha = this.flow;
        context.beginPath();
        context.arc(halfSize, halfSize, halfSize, 0, ONE);
        context.closePath();
        context.fill();
    }


    drawImage(size) {
        if (this.transformedImageIsDirty)
            this.transformImage();
        try {
            this.context.drawImage(this.transformedImage, 0, 0, size, size * this.imageRatio);
        }
        catch (e) {
            this.drawCircle(size);
        }
    }

    drawTo(x, y, scale) {
        var scaledSize = this.size * scale;
        var nrm = this.dir + QUARTER;
        var nr = this.normalSpread * scaledSize * this.spreadRandom();
        var tr = this.tangentSpread * scaledSize * this.spreadRandom();
        var ra = this.rotateToDirection ? this.angle + this.dir : this.angle;
        var width = scaledSize;
        var height = width * this.imageRatio;
        var boundWidth = abs(height * sin(ra)) + abs(width * cos(ra));
        var boundHeight = abs(width * sin(ra)) + abs(height * cos(ra));
        x += Math.cos(nrm) * nr + Math.cos(this.dir) * tr;
        y += Math.sin(nrm) * nr + Math.sin(this.dir) * tr;
        let context = this.context
        context.save();
        context.translate(x, y);
        context.rotate(ra);
        context.translate(-(width * 0.5), -(height * 0.5));
        this.drawFunction(width);
        context.restore();
        this.appendDirtyRect(x - (boundWidth * 0.5),
            y - (boundHeight * 0.5),
            boundWidth, boundHeight);
    }
    constructor() {
    }

    down(x, y, scale) {
        console.log('brush down',this)
        // if (this.context == null)
        //     throw 'brush needs the context';
        this.dir = 0;
        this.dirtyRect = { x: 0, y: 0, width: 0, height: 0 };
        if (scale > 0) {
            if (this.rotateToDirection || this.normalSpread != 0 || this.tangentSpread != 0)
                this.reserved = { x: x, y: y, scale: scale };
            else
                this.drawTo(x, y, scale);
        }
        this.delta = 0;
        this.lastX = this.prevX = x;
        this.lastY = this.prevY = y;
        this.prevScale = scale;
    }
    move(x, y, scale) {
        if (this.context == null)
            throw 'brush needs the context';
        if (scale <= 0) {
            this.delta = 0;
            this.prevX = x;
            this.prevY = y;
            this.prevScale = scale;
            return;
        }
        var dx = x - this.prevX;
        var dy = y - this.prevY;
        var ds = scale - this.prevScale;
        var d = sqrt(dx * dx + dy * dy);
        this.prevX = x;
        this.prevY = y;
        this.delta += d;
        var midScale = (this.prevScale + scale) * 0.5;
        var drawSpacing = this.size * this.spacing * midScale;
        var ldx = x - this.lastX;
        var ldy = y - this.lastY;
        var ld = sqrt(ldx * ldx + ldy * ldy);
        this.dir = atan2(ldy, ldx);
        if (ldx || ldy)
            this.drawReserved();
        if (drawSpacing < 0.5)
            drawSpacing = 0.5;
        if (this.delta < drawSpacing) {
            this.prevScale = scale;
            return;
        }
        var scaleSpacing = ds * (drawSpacing / this.delta);
        if (ld < drawSpacing) {
            this.lastX = x;
            this.lastY = y;
            this.drawTo(this.lastX, this.lastY, scale);
            this.delta -= drawSpacing;
        } else {
            while (this.delta >= drawSpacing) {
                ldx = x - this.lastX;
                ldy = y - this.lastY;
                var tx = cos(this.dir);
                var ty = sin(this.dir);
                this.lastX += tx * drawSpacing;
                this.lastY += ty * drawSpacing;
                this.prevScale += scaleSpacing;
                this.drawTo(this.lastX, this.lastY, this.prevScale);
                this.delta -= drawSpacing;
            }
        }
        this.prevScale = scale;
    }
    up(x, y, scale) {
        this.dir = atan2(y - this.lastY, x - this.lastX);
        this.drawReserved();
        return this.dirtyRect;
    }

}


// }