import { BaseEvent } from '../../const';
import { input, InputEvent } from '../../../utils/Input';
import { isArray } from 'util';
import { imgToTex, isIn, PIXI_MakeMatrixGraphics, PIXI_MOUSE_EVENT, PIXI_RECT, posInObj } from '../../../utils/PixiEx';
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
function angleDeg(p1, p2) {
    let angle = Math.atan2(p1.y - p2.y, p1.x - p2.x)
    angle = angle * 360 / (2 * Math.PI);
    if (angle < 0) {
        angle = angle + 360;
    }
    return angle
    // return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 360 / Math.PI;
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

function lineDistance(point1, point2) {
    var xs = 0;
    var ys = 0;
    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}
export class ColorPicker extends Docker {
    private _colorMap: PIXI.Graphics
    private _colorWheel: PIXI.Graphics
    private _colorWheelRange = { inner: 0, outter: 0 }
    private _gColorFg: PIXI.Graphics
    private _gColorBg: PIXI.Graphics
    private _cursorWheel: PIXI.Graphics
    private _cursorMap: PIXI.Graphics
    private _gFgBgFrame: PIXI.Graphics

    private _colorMapWidth = 0
    private _isFg = true

    private _hueDeg = 0;
    private _v = 1
    private _s = 1
    private _colorFg = { color: 0xff0000, hue: 0, v: 1, s: 1 }
    private _colorBg = { color: 0x0000ff, hue: 240, v: 1, s: 1 }
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
        this._initColorFgBg()

        this._resizeColorMapWheel(this.width - 150)
        this._initCursor()


        this.setHue(0)
        this.setBgColor(0x0000ff, 240, 1, 1)
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
            if (this._onMoveWheel(e)) {
                let mid2 = null, uid2 = null
                mid2 = input.on(InputEvent.MOUSE_MOVE, (e) => {
                    this._onMoveWheel(e, true)
                })
                uid2 = input.on(InputEvent.MOUSE_UP, (e) => {
                    this._onMoveWheel(e)
                    input.del(InputEvent.MOUSE_MOVE, mid2)
                    input.del(InputEvent.MOUSE_UP, uid2)
                })
            }
            if (isIn(e, this))
                return InputEvent.stopPropagation
        })
        ///
        // var h = 0
        // setInterval(() => {
        //     if (h > 360)
        //         h = 0
        //     this.setHue(h++)
        // }, 50)
    }

    private _onMoveWheel(e, isMove = false) {
        let cpoint = { x: this._colorMap.x + this._colorMap.width * .5, y: this._colorMap.y + this._colorMap.height * .5 }
        let wheelPoint = posInObj(this, e)
        let r = lineDistance(wheelPoint, cpoint)
        // console.log('lineDistance', r)
        if (isMove || r > this._colorWheelRange.inner && r < this._colorWheelRange.outter) {
            let d = angleDeg(wheelPoint, cpoint) + 135
            if (d > 360)
                d -= 360
            this.setHue(d)
            return true
        }
        return false
    }

    private _onMove(e) {
        let pos = posInObj(this._colorMap, e)
        if (pos.x < 0)
            pos.x = 0
        else if (pos.x > this._colorMap.width - 1)
            pos.x = this._colorMap.width - 1
        if (pos.y < 0)
            pos.y = 0
        else if (pos.y > this._colorMap.height - 1)
            pos.y = this._colorMap.height - 1

        this._cursorMap.x = this._colorMap.x + pos.x - 3
        this._cursorMap.y = this._colorMap.y + pos.y - 3
        this._s = pos.x / this._colorMapWidth
        this._v = 1 - pos.y / this._colorMapWidth
        this._updateFg()
    }

    toggleFgBg() {
        this._isFg = !this._isFg
        if (this._isFg) {
            this._frameFg()
            console.log('Fg', this._colorFg);
            this.setHue(this._colorFg.hue, this._colorFg.v, this._colorFg.s)
        }
        else {
            this._frameBg()
            console.log('Bg', this._colorBg);
            this.setHue(this._colorBg.hue, this._colorBg.v, this._colorBg.s)
        }
    }

    private _initColorFgBg() {
        this._gFgBgFrame = PIXI_RECT(0, 0, 0, 15, 15)
        this._gFgBgFrame.beginFill(0xffffff)
            .drawRect(1, 1, 13, 13)
            .cacheAsBitmap = true
        this._gColorFg = new PIXI.Graphics
        this._gColorFg.x = 10
        this._gColorFg.y = 240

        this._gColorBg = new PIXI.Graphics
        this.addChild(this._gFgBgFrame)
        this.addChild(this._gColorBg)
        this.addChild(this._gColorFg)

        this._gColorBg.x = this._gColorFg.x + 20
        this._gColorBg.y = this._gColorFg.y + 20
        this._frameFg()
    }
    private _frameFg() {
        this._gFgBgFrame.x = this._gColorFg.x - 2
        this._gFgBgFrame.y = this._gColorFg.y - 2
    }
    private _frameBg() {
        this._gFgBgFrame.x = this._gColorBg.x + 22// + 2
        this._gFgBgFrame.y = this._gColorBg.y + 22// + 2
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
        this._cursorMap.x = this._colorMap.x + this._colorMap.width - 1 - 3
        this._cursorMap.y = this._colorMap.y - 3
    }

    resize(width, height) {
        super.resize(width, height)
        this._resizeColorMapWheel(width - 150)
    }
    //0~360
    setHue(hue, v?, s?) {
        this._hueDeg = hue
        if (v != null) {
            this._v = v
            this._cursorMap.y = this._colorMap.y + (1 - v) * (this._colorMap.height - 1) - 3
        }
        if (s != null) {
            this._s = s
            this._cursorMap.x = this._colorMap.x + s * (this._colorMap.width - 1) - 3
        }
        this._cursorWheel.rotation = (hue - 135) * PIXI.DEG_TO_RAD
        this._updateMap()
        this._updateFg()
    }

    getColor() {
        if (this._isFg)
            return this._colorFg.color
        return this._colorBg.color
    }

    setFgColor(color, hue?) {
        this._colorFg.color = color
        if (hue != null)
            this._colorFg.hue = hue
        else {
            this._colorFg.hue = this._hueDeg
            this._colorFg.v = this._v
            this._colorFg.s = this._s
        }
        this._gColorFg.beginFill(color)
            .drawRect(0, 0, 35, 35)
    }

    setBgColor(color, hue?) {
        this._colorBg.color = color
        if (hue != null)
            this._colorBg.hue = hue
        else {
            this._colorBg.hue = this._hueDeg
            this._colorBg.v = this._v
            this._colorBg.s = this._s
        }
        this._gColorBg.beginFill(color)
            .drawRect(0, 0, 35, 35)
    }

    private _updateFg() {
        let c = HSVtoRGB(this._hueDeg, this._s, this._v)
        if (this._isFg)
            this.setFgColor(c)
        else
            this.setBgColor(c)
        this.emit(BaseEvent.CHANGED)
    }
    private _updateMapCursor() {

    }
    private _updateMap(width?) {
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

    private _resizeColorMapWheel(width) {
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
        this._colorWheelRange.inner = r - wheelWidth * .5
        this._colorWheelRange.outter = this._colorWheelRange.inner + wheelWidth
        this._colorWheel.lineStyle(3, 0)
            .drawCircle(cx, cx, this._colorWheelRange.inner)
            .drawCircle(cx, cx, this._colorWheelRange.outter)
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