import { input, InputEvent } from '../../../utils/Input';
export class PaintView extends PIXI.Graphics {
    _lineArr = []
    constructor() {
        super()
        this.beginFill(0xeeeeee, 0.8)
        this.drawRect(0, 0, 1000, 700)
        this.endFill()

        // this.lineWidth = 5
        // this.lineColor = 0xff0000
        this.lineStyle(10, 0xff0000)
        this.moveTo(50,50)
        this.lineTo(500,500)

        var line = []
        var lastPos = null, isPress = false
        input.on(InputEvent.MOUSE_DOWN, (e) => {

            lastPos = this.inPos(e)
            this.moveTo(lastPos.x, lastPos.y)
            this.lineTo(lastPos.x, lastPos.y)
            isPress = true

            if (line.length) {
                // this._lineArr.push(line)
                // line = []
            }
        })
        input.on(InputEvent.MOUSE_MOVE, (e) => {
                lastPos = this.inPos(e)
            
            if (isPress) {

                this.lineTo(lastPos.x, lastPos.y)
                console.log("line", lastPos)

                // line.push({ x: e.mx, y: e.my })
            }
            
        })
        input.on(InputEvent.MOUSE_UP, (e) => {
            isPress = false
            if (line.length) {
                // this._lineArr.push(line)
                // line = []
            }
        })
    }

    inPos(e): { x: number, y: number } {
        let p = this.toGlobal(new PIXI.Point(0, 0))
        return { x: e.mx - p.x, y: e.my - p.y }
    }
}