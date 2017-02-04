import { Col, newStyle } from '../model/Color';
import { PIXI_MOUSE_EVENT, PIXI_RECT } from '../../utils/PixiEx';
import { Button } from './Button';
export class Dialog extends PIXI.Container {
    _content: any

    constructor(content: any, title: string) {
        super()
        this.addChild(PIXI_RECT(Col.panelBg,0,0,300,250))
        
        let btn = new Button({ text: "ok" })
        btn.on(PIXI_MOUSE_EVENT.up, () => {
            this.destroy(true)
        })
        btn.x = 130
        btn.y = 180
        this.addChild(btn)

        let titleText = new PIXI.Text(title, newStyle())
        this.addChild(titleText)
    }

    show() {
        if (this.parent) {
            this.x = (this.parent.width - this.width) * .5
            this.y = (this.parent.height - this.height) * .5
        }
    }

    hide() {

    }
}