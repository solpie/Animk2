import { HSBRect } from '../../../utils/anmkp/HSBRect';
import { imgToTex } from '../../../utils/PixiEx';
import { Docker } from '../Docker';
export class ColorPicker extends Docker {
    _hsbRect:HSBRect
    constructor() {
        super()
        this._hsbRect = new HSBRect(280,280)
        // this._hsbRect.hue = 1
        document.body.appendChild(this._hsbRect.DOMElement)
        // let sp = new PIXI.Sprite(imgToTex(this._hsbRect.getImg()))
        // sp.x = 10
        // sp.y = 20
        // this.addChild(sp)
    }
}