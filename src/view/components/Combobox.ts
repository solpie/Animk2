import { Col } from '../model/Color';
export class Combobox extends PIXI.Container {
    _w: number
    _h: number
    _bg: PIXI.Graphics
    constructor(options:Array<string>,width=120, height=30) {
        super()
        this._bg = this.addChild(new PIXI.Graphics()
            .beginFill(Col.panelBg)
            .drawRect(0, 0, width, height)) as PIXI.Graphics
    }

    resize(width, height) {
        this._w = width
        this._h = height
        this._bg.width = width
        this._bg.height = height
    }
}