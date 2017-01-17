import { Stacker } from './Stacker';
class TimestampBar extends PIXI.Container {
    constructor(parent: PIXI.Container) {
        super()
        parent.addChild(this)
    }

    get height() {
        return 45
    }
}
export class Tracker extends PIXI.Container {
    timestampBar: TimestampBar
    stackerArr: Array<Stacker>
    constructor() {
        super()
        this.timestampBar = new TimestampBar(this)
        this.stackerArr = []
    }

    newStacker() {
        let s = new Stacker('track#' + (this.stackerArr.length + 1))
        this.addChild(s)
        this.stackerArr.push(s)
        this._updateVPos()
    }

    _updateVPos() {
        for (var i = 0; i < this.stackerArr.length; i++) {
            var s = this.stackerArr[i];
            s.y = this.timestampBar.height + (s.height + 1) * i
        }
    }
}