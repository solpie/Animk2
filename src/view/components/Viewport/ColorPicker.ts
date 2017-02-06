import { input, InputEvent } from '../../../utils/Input';
import { isArray } from 'util';
import { imgToTex, isIn, PIXI_MakeMatrixGraphics, PIXI_MOUSE_EVENT, posInObj } from '../../../utils/PixiEx';
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
function HSVtoRGB(H, S, V, isArray = false): any {
    var V2 = V * (1 - S);
    var r = ((H >= 0 && H <= 60) || (H >= 300 && H <= 360)) ? V : ((H >= 120 && H <= 240) ? V2 : ((H >= 60 && H <= 120) ? mix(V, V2, (H - 60) / 60) : ((H >= 240 && H <= 300) ? mix(V2, V, (H - 240) / 60) : 0)));
    var g = (H >= 60 && H <= 180) ? V : ((H >= 240 && H <= 360) ? V2 : ((H >= 0 && H <= 60) ? mix(V2, V, H / 60) : ((H >= 180 && H <= 240) ? mix(V, V2, (H - 180) / 60) : 0)));
    var b = (H >= 0 && H <= 120) ? V2 : ((H >= 180 && H <= 300) ? V : ((H >= 120 && H <= 180) ? mix(V2, V, (H - 120) / 60) : ((H >= 300 && H <= 360) ? mix(V, V2, (H - 300) / 60) : 0)));

    // return {
    //     r: Math.round(r * 255),
    //     g: Math.round(g * 255),
    //     b: Math.round(b * 255)
    // };
    if (isArray)
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
    return Math.round(r * 255) * 0x010000 +
        Math.round(g * 255) * 0x0100
        + Math.round(b * 255)
}

export class ColorPicker extends Docker {
    _colorMap: PIXI.Graphics
    _colorWheel: PIXI.Graphics
    _colorFg: PIXI.Graphics
    _colorBg: PIXI.Graphics
    _cursorWheel: PIXI.Graphics
    _cursorMap: PIXI.Graphics
    _colorMapWidth = 0

    _hueDeg = 0;
    _v = 1
    _s = 1
    constructor() {
        super()
        this._colorMap = new PIXI.Graphics()
        this._colorWheel = new PIXI.Graphics()
        this._cursorWheel = new PIXI.Graphics()
        this._cursorMap = new PIXI.Graphics()
        this.addChild(this._colorMap)
        this.addChild(this._colorWheel)
        this.addChild(this._cursorWheel)
        this.addChild(this._cursorMap)
        this._resizeColorMapWheel(this.width - 150)
        this._initCursor()

        this._initColorFgBg()

        this.setHue(0)

        // this.interactive = true
        // this.on(PIXI_MOUSE_EVENT.down, () => {
        //     console.log('colorMap down')
        // })
        input.on(InputEvent.MOUSE_DOWN, (e) => {
            let mid = null, uid = null
            let isin = isIn(e, this._colorMap)
            if (isin) {
                this._onMove(e)
                mid = input.on(InputEvent.MOUSE_MOVE, (e) => {
                    this._onMove(e)
                })
                uid = input.on(InputEvent.MOUSE_UP, (e) => {
                    this._onMove(e)
                    input.del(InputEvent.MOUSE_MOVE, mid)
                    input.del(InputEvent.MOUSE_UP, uid)
                })
            }
        })
        ///
        // var h = 0
        // setInterval(() => {
        //     if (h > 360)
        //         h = 0
        //     this.setHue(h++)
        // }, 50)
    }
    _onMove(e) {
        let isin = isIn(e, this._colorMap)
        if (isin) {
            let pos = posInObj(this._colorMap, e)
            this._cursorMap.x = this._colorMap.x + pos.x - 3
            this._cursorMap.y = this._colorMap.y + pos.y - 3
            this._s = pos.x / this._colorMapWidth
            this._v = 1 - pos.y / this._colorMapWidth
            this._updateFg()
        }
    }
    _initColorFgBg() {
        this._colorFg = new PIXI.Graphics
        this.addChild(this._colorFg)
        this._colorFg.x = 5
        this._colorFg.y = 155
    }
    setRgb(rgb: Array<Number>) {

    }
    private _initCursor() {
        let b = [
            '.......',
            '.     .',
            '.     .',
            '.     .',
            '.     .',
            '.     .',
            '.......',
        ]
        let w = [
            '.....',
            '.   .',
            '.   .',
            '.   .',
            '.....'
        ]
        PIXI_MakeMatrixGraphics(b, 0, this._cursorMap)
        PIXI_MakeMatrixGraphics(w, 0xffffff, this._cursorMap, 1, 1)
        this._cursorMap.cacheAsBitmap = true
    }

    resize(width, height) {
        super.resize(width, height)
        this._resizeColorMapWheel(width - 150)
    }
    //0~360
    setHue(v) {
        this._hueDeg = v
        this._cursorWheel.rotation = (v - 135) * PIXI.DEG_TO_RAD
        this._updateMap()
    }
    getColor() {
        // return HSVtoRGB(this._hueDeg, 1, 1)
    }
    _updateFg() {
        this._colorFg.beginFill(HSVtoRGB(this._hueDeg, this._s, this._v))
            .drawRect(0, 0, 35, 35)
    }
    _updateMap(width?) {
        var w;
        if (width != null)
            w = this._colorMapWidth = width
        else
            w = this._colorMapWidth
        this._colorMap.cacheAsBitmap = false
        this._colorMap.clear()
        var col1 = [255, 255, 255]
        var col2 = HSVtoRGB(this._hueDeg, 1, 1, true)
        var weight
        var wInner = w - 1
        for (var i = 0; i < wInner; i++) {
            weight = 1 - i / wInner
            for (var j = 0; j < wInner; j++) {
                var c = mixRGB(col1, col2, weight, 1 - j / wInner)
                this._colorMap.beginFill(c).drawRect(i + 1, j + 1, 1, 1)
            }
        }
        this._colorMap.endFill()
            .lineStyle(1, 0x000000)
            .drawRect(0, 0, w, w)
            .cacheAsBitmap = true
    }

    _resizeColorMapWheel(width) {
        var w = width
        this._updateMap(width)
        var wheelWidth = 20
        this._colorMap.x = (this.width - this._colorMap.width) * .5
        this._colorMap.y = (this.height - this._colorMap.height) * .5

        this._colorWheel.x = this._colorMap.x
        this._colorWheel.y = this._colorMap.y
        let cx = w * .5
        let r = cx * 1.414 + wheelWidth - 5
        this._colorWheel.clear()
        for (var i = 0; i < 360; i++) {
            this._colorWheel.lineStyle(wheelWidth, HSVtoRGB(i, 1, 1))
            var startDeg = i - 90 - 45
            this._colorWheel.arc(cx, cx, r, startDeg * PIXI.DEG_TO_RAD, (startDeg + 1.1) * PIXI.DEG_TO_RAD)
        }
        this._colorWheel.lineStyle(3, 0)
            .drawCircle(cx, cx, r - wheelWidth * .5)
            .drawCircle(cx, cx, r + wheelWidth * .5)
            .cacheAsBitmap = true

        r = r - 10
        this._cursorWheel.clear()
            .lineStyle(2, 0)
            .moveTo(r - 4, -2)
            .lineTo(r + wheelWidth + 4, -4)
            .lineTo(r + wheelWidth + 4, 4)
            .lineTo(r - 4, 4)
            .lineTo(r - 4, -2)
            .cacheAsBitmap = true
        this._cursorWheel.x = this._colorMap.x + cx
        this._cursorWheel.y = this._colorMap.y + cx
    }
}