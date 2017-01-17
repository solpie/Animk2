import { ScrollEvent } from './const';
import { Scroller } from './components/Scroller';
import { Stacker } from './Stacker';
class TimestampBar extends PIXI.Container {
    hScroller:Scroller
    constructor(parent: PIXI.Container) {
        super()
        parent.addChild(this)
        let hs = new Scroller('h',600,0,100)
        this.addChild(hs)
        this.hScroller = hs
    }

    get height() {
        return 45
    }
}
export class Tracker extends PIXI.Container {
    timestampBar: TimestampBar
    stackerArr: Array<Stacker>
    vScroller: Scroller
    stackerCtn: PIXI.Container
    constructor() {
        super()
        this.timestampBar = new TimestampBar(this)

        this.stackerCtn = new PIXI.Container()
        this.stackerCtn.y = this.timestampBar.height
        this.addChild(this.stackerCtn)
        this.stackerArr = []

        this.vScroller = new Scroller('v', 300, 0, 100)
        this.vScroller.x = 200
        this.vScroller.y = this.timestampBar.height
        this.vScroller.evt.on(ScrollEvent.CHANGED, (v) => {

        })
        this.addChild(this.vScroller)
    }

    newStacker() {
        let s = new Stacker('track#' + (this.stackerArr.length + 1))
        this.stackerCtn.addChild(s)
        this.stackerArr.push(s)
        this._updateVPos()
    }

    _updateVPos() {
        var s;
        for (var i = 0; i < this.stackerArr.length; i++) {
            s = this.stackerArr[i];
            s.y = (s.height + 1) * i
        }
        // if (s)
        //     this.vScroller.setMax((s.height + 1) * this.stackerArr.length)
    }

    resize(width, height) {
        this.vScroller.setMax(height-this.timestampBar.height)
    }
}