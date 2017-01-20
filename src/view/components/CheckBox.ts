import { EventDispatcher } from '../../utils/EventDispatcher';
import { InputEvent } from '../const';
import { Col } from '../model/Color';
import { isIn, PIXI_MOUSE_EVENT, PIXI_RECT } from '../../utils/PixiEx';
export class CheckBox extends PIXI.Container {
    gCheck: PIXI.Graphics
    constructor(globalEvent: EventDispatcher) {
        super()
        let r = 3
        let bg = new PIXI.Graphics().beginFill(Col.panelBg)
            .lineStyle(2, 0x8a8a8a)
            .drawRoundedRect(r, r, 20 - r * 2, 20 - r * 2, r)
        this.addChild(bg)

        this.gCheck = PIXI_RECT(0x8a8a8a, 7, 7, 6, 6)
        this.addChild(this.gCheck)
        globalEvent.on(InputEvent.MOUSE_UP, (e) => {
            if (isIn(e, this)) {
                this.checked = !this.checked
            }
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
    }

    get checked() {
        return this.gCheck.visible
    }
}