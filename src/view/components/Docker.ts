import { Col } from '../model/Color';
import { PIXI_BORDER, PIXI_RECT } from '../../utils/PixiEx';
export class Docker extends PIXI.Container {
    _bg: PIXI.Graphics
    _border: PIXI.Graphics
    constructor() {
        super()
        this._bg = this.addChild(PIXI_RECT(Col.panelBg, 0, 0, 300, 300)) as PIXI.Graphics
        this._border = PIXI_BORDER(1, Col.panelBorder, 300, 300)
        this.addChild(this._border)
    }
    
    resize(width, height) {
        PIXI_BORDER(1, Col.panelBorder, width, height, this._border)
    }
}