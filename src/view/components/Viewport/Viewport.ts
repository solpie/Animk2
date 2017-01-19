import { ViewConst } from '../../const';
import { CompView } from './CompView';
export class Viewport extends PIXI.Container {
    compView: CompView
    constructor() {
        super()
        this.compView = new CompView(ViewConst.COMP_WIDTH,ViewConst.COMP_HEIGHT)
        this.compView.x = 20
        this.compView.y = 20
        this.addChild(this.compView)
    }

}