import { imgToTex, PIXI_MakeMatrixGraphics } from '../../../utils/PixiEx';
import { Docker } from '../Docker';
function mixRGB(color1, color2, weight, value = 1) {
    var p = weight;
    var w = p * 2 - 1;
    var w1 = (w / 1 + 1) / 2;
    var w2 = 1 - w1;
    w1 *= value
    w2 *= value
    // var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
    // Math.round(color1[1] * w1 + color2[1] * w2),
    // Math.round(color1[2] * w1 + color2[2] * w2)];
    // return rgb;
    return (Math.round(color1[0] * w1 + color2[0] * w2) * 0x010000) + (Math.round(color1[1] * w1 + color2[1] * w2) * 0x0100)
        + Math.round(color1[2] * w1 + color2[2] * w2)
}
function mix(a, b, v) {
    return (1 - v) * a + v * b;
}
//0 <= h<=360, s, v <= 1
function HSVtoRGB(H, S, V) {
    var V2 = V * (1 - S);
    var r = ((H >= 0 && H <= 60) || (H >= 300 && H <= 360)) ? V : ((H >= 120 && H <= 240) ? V2 : ((H >= 60 && H <= 120) ? mix(V, V2, (H - 60) / 60) : ((H >= 240 && H <= 300) ? mix(V2, V, (H - 240) / 60) : 0)));
    var g = (H >= 60 && H <= 180) ? V : ((H >= 240 && H <= 360) ? V2 : ((H >= 0 && H <= 60) ? mix(V2, V, H / 60) : ((H >= 180 && H <= 240) ? mix(V, V2, (H - 180) / 60) : 0)));
    var b = (H >= 0 && H <= 120) ? V2 : ((H >= 180 && H <= 300) ? V : ((H >= 120 && H <= 180) ? mix(V2, V, (H - 120) / 60) : ((H >= 300 && H <= 360) ? mix(V, V2, (H - 300) / 60) : 0)));

    // return {
    //     r: Math.round(r * 255),
    //     g: Math.round(g * 255),
    //     b: Math.round(b * 255)
    // };
    return Math.round(r * 255) * 0x010000 +
        Math.round(g * 255) * 0x0100
        + Math.round(b * 255)
}

export class ColorPicker extends Docker {
    _map: PIXI.Graphics
    constructor() {
        super()
        this._map = new PIXI.Graphics()

        this.addChild(this._map)
        this._resizeColorMapWheel(this.width - 150)
    }

    resize(width, height) {
        super.resize(width, height)
        this._resizeColorMapWheel(width - 150)
    }
    _resizeColorMapWheel(width) {
        this._map.clear()
        var w = width
        var col1 = [255, 255, 255]
        var col2 = [255, 0, 0]
        var weight = 1
        for (var i = 0; i < w; i++) {
            weight = 1 - i / w
            for (var j = 0; j < w; j++) {
                var c = mixRGB(col1, col2, weight, 1 - j / w)
                this._map.beginFill(c).drawRect(i, j, 1, 1)
            }
        }
        this._map.endFill()
        this._map.x = (this.width - this._map.width) * .5
        this._map.y = (this.height - this._map.height) * .5
        let cx = w * .5
        let r = cx * 1.414 + 20
        for (var i = 0; i < 360; i++) {
            this._map.lineStyle(20, HSVtoRGB(i, 1, 1))
            var startDeg = i-90-45
            this._map.arc(cx, cx, r, startDeg * PIXI.DEG_TO_RAD, (startDeg + 1.1) * PIXI.DEG_TO_RAD)
        }
        this._map.lineStyle(3, 0)
        this._map.drawCircle(cx, cx, r - 10)
        this._map.drawCircle(cx, cx, r + 10)

        this._map.cacheAsBitmap = true
    }
}