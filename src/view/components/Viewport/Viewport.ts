import { ColorPicker } from './ColorPicker';
import { Docker } from '../Docker';
import { PaintView } from './PaintView';
import { Painter } from '../../../utils/anmkp/Painter';
import { keyDownMap } from '../../model/ShortCut';
import { ImageLayerInfo } from '../../model/tm/ImageLayerInfo';
import { PaintCanvas } from './PaintCanvas';
import { Curosr, input, InputEvent, setCursor } from '../../../utils/Input';
import { imgToTex, PIXI_MOUSE_EVENT, posInObj, setPivot } from '../../../utils/PixiEx';
import { ViewConst } from '../../const';
import { CompView } from './CompView';
export class Viewport extends PIXI.Container {
    compView: CompView
    paintView: PaintView
    zoomStep = 0.20
    _h: number
    dockerColorPicker:ColorPicker
    constructor(compRender) {
        super()
        this.paintView = new PaintView(ViewConst.COMP_WIDTH, ViewConst.COMP_HEIGHT)
        this.compView = new CompView(ViewConst.COMP_WIDTH, ViewConst.COMP_HEIGHT)
        compRender.addChild(this.compView)
        // this.paintCanvas = new PaintCanvas()
        this._pan(20, 20)
        input.on(InputEvent.MOUSE_WHEEL, (e) => {
            this._zoom(e)
        })

        var panCompViewFunId = null, upFuncId = null
        keyDownMap[' '] = (e) => {
            if (!panCompViewFunId) {

                panCompViewFunId = input.on(InputEvent.MOUSE_MOVE, (e) => {
                    this.panCompView(e)
                })
                upFuncId = input.on(InputEvent.KEY_UP, (e) => {
                    if (panCompViewFunId) {
                        setCursor()
                        this.lastX = null
                        this.lastY = null
                        input.del(InputEvent.MOUSE_MOVE, panCompViewFunId)
                        input.del(InputEvent.KEY_UP, upFuncId)
                        panCompViewFunId = null
                        upFuncId = null
                    }
                })
            }
        }
        //     else if (e.key == "r" && e.ctrlKey) {
        //         console.log('render')
        //         // let sp = new PIXI.Sprite(imgToTex(this.paintCanvas.getImg()))
        //         // this.addChild(sp)
        //     }

        // this.painter = new Painter()
        // document.body.appendChild(this.painter.paintingCanvas)
        this.dockerColorPicker = new ColorPicker()
        this.dockerColorPicker.x =800
        this.dockerColorPicker.y =10
        this.addChild(this.dockerColorPicker)
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
    private _zoom(e) {
        let d = this.compView
        let pos = posInObj(this.compView, e, true)
        let dtS = - e.deltaY / 200 * this.zoomStep
        d.x -= dtS * pos.x
        d.y -= dtS * pos.y
        let s = d.scale.x + dtS
        if (s < .05)
            s = 0.05
        d.scale.x = d.scale.y = s

        this.paintView.x = d.x
        this.paintView.y = d.y
        this.paintView.zoom(s)
        // this.paintView.updateShowRect()
    }
    _pan(x, y) {
        this.compView.x = x
        this.compView.y = y

        this.paintView.x = x
        this.paintView.y = y
        // this.paintView.updateShowRect()

    }
    resize(width, height) {
        if (width == null)
            width = this.width
        this._h = height
        // this.paintView.setParentRect({height:height})
        // this.paintView.updateShowRect()
        
    }
}