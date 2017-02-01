import { ImageLayerInfo } from '../../model/tm/ImageLayerInfo';
import { PaintCanvas } from './PaintCanvas';
import { Curosr, input, InputEvent, setCursor } from '../../../utils/Input';
import { imgToTex, PIXI_MOUSE_EVENT, posInObj, setPivot } from '../../../utils/PixiEx';
import { ViewConst } from '../../const';
import { CompView } from './CompView';
export class Viewport extends PIXI.Container {
    compView: CompView
    paintCanvas: PaintCanvas

    zoomStep = 0.15
    constructor() {
        super()
        this.compView = new CompView(ViewConst.COMP_WIDTH, ViewConst.COMP_HEIGHT)
        this.addChild(this.compView)
        this.paintCanvas = new PaintCanvas()
        this._pan(20, 20)
        // this.compView.x = 70
        // this.compView.y = 70
        // this.compView.scale.x = this.compView.scale.y = 0.5
        // let pos = posInObj(this.compView, { mx: 10, my: 10 })
        // console.log(pos)
        input.on(InputEvent.MOUSE_WHEEL, (e) => {
            console.log('wheel', e)

            //deltaY
            if (e.deltaY > 0) {
            }
            let d = this.compView
            // setPivot(d)
            let pos = posInObj(this.compView, e)
            // if (pos.x > 0 && pos.y > 0)
            setPivot(d, pos.x - d.x, pos.y - d.y)
            let dtS = - e.deltaY / 200 * this.zoomStep
            console.log(pos, dtS)

            // else
            //     setPivot(d, this.width / 2, this.height / 2)
            let s = d.scale.x - e.deltaY / 200 * this.zoomStep
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
            else if (e.key == 'Enter') {
                console.log('enter')
                let t1 = new Date().getMilliseconds()
                let buf = this.paintCanvas.getPixelBuf()
                let w = 1280, h = 720;
                let a: Array<ImageLayerInfo> = []
                let imgLayer = new ImageLayerInfo()
                imgLayer.width = w
                imgLayer.height = h
                imgLayer.pixels = buf
                a.push(imgLayer)
                ImageLayerInfo.png2psd(a, w,
                    h, "rgba",
                    'd:\\2.psd', (p) => {
                        let t2 = new Date().getMilliseconds()
                        console.log('addon cast time:', t2 - t1)
                    });
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