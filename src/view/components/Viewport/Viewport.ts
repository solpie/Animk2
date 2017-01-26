import { input, InputEvent } from '../../model/Input';
import { PIXI_MOUSE_EVENT, posInObj, setPivot } from '../../../utils/PixiEx';
import { ViewConst } from '../../const';
import { CompView } from './CompView';
export class Viewport extends PIXI.Container {
    compView: CompView

    zoomStep = 0.15
    constructor() {
        super()
        this.compView = new CompView(ViewConst.COMP_WIDTH, ViewConst.COMP_HEIGHT)
        this.compView.x = 20
        this.compView.y = 20
        this.addChild(this.compView)

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
            console.log(pos)
            // if (pos.x > 0 && pos.y > 0)
            setPivot(d, pos.x - d.x, pos.y - d.y)
            // else
            //     setPivot(d, this.width / 2, this.height / 2)
            let s = d.scale.x - e.deltaY / 200 * this.zoomStep
            d.scale.x = d.scale.y = s

        })

        var panCompViewFunId=null
        input.on(InputEvent.KEY_DOWN, (e) => {
            console.log(e)
            if (e.key == " "&&!panCompViewFunId) {
                panCompViewFunId = input.on(InputEvent.MOUSE_MOVE, (e) => {
                    this.panCompView(e)
                })
            }
        })

        input.on(InputEvent.KEY_UP, (e) => {
            if (panCompViewFunId) {
                this.lastX = null
                this.lastY = null
                input.del(InputEvent.MOUSE_MOVE, panCompViewFunId)
                panCompViewFunId = null
            }
        })
    }

    lastX = null
    lastY = null
    panCompView(e) {
        if (!this.lastX)
            this.lastX = e.mx
        if (!this.lastY)
            this.lastY = e.my
        let dtX = e.mx - this.lastX, dtY = e.my - this.lastY
        this.compView.x += dtX
        this.compView.y += dtY
        this.lastX = e.mx
        this.lastY = e.my
    }

}