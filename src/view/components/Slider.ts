import { input, InputEvent } from '../model/Input';
import { BaseEvent } from '../const';
import { Col, newStyle } from '../model/Color';
import { isIn, PIXI_RECT, setupDrag } from '../../utils/PixiEx';
export class Slider extends PIXI.Container {
    _value
    _max
    _min
    thumb: PIXI.Graphics
    label: PIXI.Text
    constructor(min, max, value) {
        super()
        this._min = min
        this._max = max

        this.addChild(PIXI_RECT(Col.panelBg, 0, 0, this.width, 20))
        let t = PIXI_RECT(0xa6a6a6, 0, 0, this.width, this.height)
        this.addChild(t)
        this.thumb = t

        let ls = newStyle()
        ls.fill = 0x666666
        let l = new PIXI.Text("", ls)
        this.addChild(l)
        l.y = 3
        l.x = 5
        this.label = l

        this.value = value


        var lastX = null, isMove = false
        setupDrag(this, (e) => {
            lastX = e.mx
            isMove = false
        }, (e) => {
            if (lastX != null) {
                var dt = e.mx - lastX
                lastX = e.mx
                var dtW = this.thumb.width + dt
                if ((dt != 0))
                    isMove = true
                this.value = (dtW / this.width) * (this._max - this._min)
            }
        }, (e) => {
            if (!isMove) {
                var p = this.thumb.toGlobal(new PIXI.Point(0, 0))
                var dt = e.mx - p.x
                this.value = (dt / this.width) * (this._max - this._min)
            }
            lastX = null
        })
        input.on(InputEvent.MOUSE_UP, (e) => {

            lastX = null
        })
    }
    get width()
    { return 80 }
    get value() {
        return this._value
    }

    set value(v) {
        if (v != undefined) {
            if (v > this._max)
                v = this._max
            if (v < this._min)
                v = this._min
            this._value = v
            let p = this._value / (this._max - this._min)
            this.label.text = (p * 100).toFixed(0) + '%'
            this.thumb.width = p * this.width
            this.emit(BaseEvent.CHANGED, v)
        }
    }
}