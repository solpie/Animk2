import { FontName } from '../const';
import { PIXI_MOUSE_EVENT } from '../../utils/PixiEx';
export class Button extends PIXI.Container {
    _label: PIXI.Text
    _bg: PIXI.Graphics
    constructor(option: { width?, height?, text?}) {
        super()
        let t = option.text || 'button'
        let w = option.width || 70
        let h = option.height || 30
        this.interactive = true
        this.buttonMode = true
        this._bg = new PIXI.Graphics().beginFill(0x333333).drawRect(0, 0, w, h)
        this.addChild(this._bg)

        let ts = {
            // fontFamily: FontName.MicrosoftYahei,
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: 0xffffff
        }
        this._label = new PIXI.Text(t, ts)
        this.addChild(this._label)

        this.on(PIXI_MOUSE_EVENT.up, () => {
        })
        this.resize(w, h)
    }
    resize(width, height) {
        this._label.x = (width - this._label.width) * .5
        this._label.y = (height - this._label.height) * .5
    }
}