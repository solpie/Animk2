import { isIn, PIXI_MOUSE_EVENT, PIXI_RECT } from '../../utils/PixiEx';
import { BaseEvent } from '../const';
import { Col } from '../model/Color';
export class CheckBox extends PIXI.Container {
    gCheck: PIXI.Graphics
    constructor() {
        super()
        let r = 3
        let bg = new PIXI.Graphics().beginFill(Col.panelBg)
            .lineStyle(2, 0x8a8a8a)
            .drawRoundedRect(r, r, 20 - r * 2, 20 - r * 2, r)
        this.addChild(bg)

        this.gCheck = PIXI_RECT(0x8a8a8a, 7, 7, 6, 6)
        this.addChild(this.gCheck)
        this.checked = false
        this.interactive = true
        this.on(PIXI_MOUSE_EVENT.up, (e) => {
              if (isIn(e, this)) 
                this.checked = !this.checked
        })
    }
    get width() {
        return 20
    }
    get height() {
        return 20
    }

    set checked(v) {
        this.gCheck.visible = v
        this.emit(BaseEvent.CHANGED,v)
    }

    get checked() {
        return this.gCheck.visible
    }
}