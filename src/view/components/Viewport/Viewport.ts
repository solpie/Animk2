import { ImageLayerInfo } from '../../model/tm/ImageLayerInfo';
import { PaintCanvas } from './PaintCanvas';
import { Curosr, input, InputEvent, setCursor } from '../../../utils/Input';
import { imgToTex, PIXI_MOUSE_EVENT, posInObj, setPivot } from '../../../utils/PixiEx';
import { ViewConst } from '../../const';
import { CompView } from './CompView';
export class Viewport extends PIXI.Container {
    compView: CompView
    paintCanvas: PaintCanvas

    zoomStep = 0.20
    constructor() {
        super()
        this.compView = new CompView(ViewConst.COMP_WIDTH, ViewConst.COMP_HEIGHT)
        this.addChild(this.compView)
        this.paintCanvas = new PaintCanvas()
        this._pan(20, 20)
        input.on(InputEvent.MOUSE_WHEEL, (e) => {
            let d = this.compView
            let pos = posInObj(this.compView, e, true)
            let dtS = - e.deltaY / 200 * this.zoomStep
            d.x -= dtS * pos.x
            d.y -= dtS * pos.y
            let s = d.scale.x + dtS
            d.scale.x = d.scale.y = s
        })

        var panCompViewFunId = null
        input.on(InputEvent.KEY_DOWN, (e) => {
            console.log(e)
            if (e.key == " " && !panCompViewFunId) {
                panCompViewFunId = input.on(InputEvent.MOUSE_MOVE, (e) => {
                    this.panCompView(e)
                })
            }
            else if (e.key == "r" && e.ctrlKey) {
                console.log('render')
                // let sp = new PIXI.Sprite(imgToTex(this.paintCanvas.getImg()))
                // this.addChild(sp)
            }

        })

        input.on(InputEvent.KEY_UP, (e) => {
            if (panCompViewFunId) {
                setCursor()
                this.lastX = null
                this.lastY = null
                input.del(InputEvent.MOUSE_MOVE, panCompViewFunId)
                panCompViewFunId = null
            }
        })
    }
    test() {

    }
    lastX = null
    lastY = null
    panCompView(e) {
        if (!this.lastX)
            this.lastX = e.mx
        if (!this.lastY)
            this.lastY = e.my
        let dtX = e.mx - this.lastX, dtY = e.my - this.lastY
        this._pan(this.compView.x + dtX, this.compView.y + dtY)
        this.lastX = e.mx
        this.lastY = e.my
        setCursor(Curosr.move)
    }

    _pan(x, y) {
        this.paintCanvas.x = this.compView.x = x
        this.paintCanvas.y = this.compView.y = y
    }

}