import { Curosr, input, setCursor } from '../../utils/Input';
import { Col } from '../model/Color';
import { PIXI_BORDER, PIXI_MOUSE_EVENT, PIXI_RECT, setupDrag } from '../../utils/PixiEx';
export class Docker extends PIXI.Container {
    _bg: PIXI.Graphics
    _border: PIXI.Graphics
    _title: PIXI.Graphics
    constructor() {
        super()
        this._bg = this.addChild(PIXI_RECT(Col.panelBg, 0, 0, 300, 300)) as PIXI.Graphics
        this._border = PIXI_BORDER(1, Col.panelBorder, 300, 300)
        this.addChild(this._border)

        let dot = 2
        this._title = new PIXI.Graphics()
            .beginFill(Col.panelBg)
            .drawRect(0, 0, 30, 80)
            .beginFill(Col.tick)
            .drawRect(4, 4, dot, dot)
            .drawRect(10, 4, dot, dot)
            .drawRect(16, 4, dot, dot)
            .drawRect(22, 4, dot, dot)
            .drawRect(4, 10, dot, dot)
            .drawRect(10, 10, dot, dot)
            .drawRect(16, 10, dot, dot)
            .drawRect(22, 10, dot, dot)
        this.addChild(this._title)
        let lx, ly
        setupDrag(this._title,
            (e) => {
                lx = e.mx
                ly = e.my
                // console.log('on title')
                // setCursor(Curosr.move)
            },
            (e) => {
                if (lx != null) {
                    this.x += e.mx - lx
                    this.y += e.my - ly
                    lx = e.mx
                    ly = e.my
                }
            },
            (e) => {
                // this.x += e.mx - lx
                // this.y += e.my - ly
                lx = null
                ly = null
            })
        // this._title.on(PIXI_MOUSE_EVENT.down, (e) => {
        //         console.log('on title')
        //         setCursor(Curosr.move)
        //         input.startDrag((e) => {

        //         }, (e) => {

        //         })
        //     })
    }

    resize(width, height) {
        PIXI_BORDER(1, Col.panelBorder, width, height, this._border)
    }
}