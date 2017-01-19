import { animk } from './Animk';
import { PIXI_MOUSE_EVENT } from '../utils/PixiEx';
import { runInThisContext } from 'vm';
import { ScrollEvent, ViewEvent } from './const';
import { Scroller } from './components/Scroller';
import { Stacker } from './Stacker';
export class TimestampBar extends PIXI.Sprite {
    gTick: PIXI.Graphics
    colTick = 0x000000
    gMask: PIXI.Graphics
    gCursor: PIXI.Graphics
    constructor() {
        super()
        this.gTick = new PIXI.Graphics()
        this.addChild(this.gTick)

        this.gMask = new PIXI.Graphics().drawRect(0, 0, 1600, this.height)
        this.addChild(this.gMask)
        this.gTick.mask = this.gMask

        this.gCursor = new PIXI.Graphics()
            .lineStyle(2, 0xff0000)
            .moveTo(0, 0)
            .lineTo(0, 500)
        this.addChild(this.gCursor)

        this.resize(1600, this.height)

        animk.on(ViewEvent.MOUSE_UP, (e) => {
            console.log('mouse up');
            this.gCursor.x = Math.floor((e.mx - this.x) / animk.frameWidth) * animk.frameWidth
        })
    }

    resize(width, height) {
        // console.log('resize timestampBar', width);

        this.gMask.clear()
        this.gMask.drawRect(0, 0, width, height)

        this.gTick.clear()
        this.gTick.lineStyle(1, this.colTick)
        for (var i = 0; i < width; i += animk.frameWidth) {
            this.gTick.moveTo(i, 15)
            this.gTick.lineTo(i, animk.frameWidth)
        }

    }

    scroll(v) {
        this.gTick.x = -v
        this.gCursor.x = -v
    }

    get height() {
        return 40
    }
}
export class Tracker extends PIXI.Container {
    timestampBar
    stackerArr: Array<Stacker>
    vScroller: Scroller
    hScroller: Scroller

    stackerCtn: PIXI.Container
    constructor() {
        super()
        this.timestampBar = new TimestampBar()
        this.timestampBar.x = 200 + 15

        let hs = new Scroller('h', 600, 0, 100)
        hs.x = 200 + 15
        // hs.y = - 15
        this.addChild(hs)
        this.hScroller = hs
        this.hScroller.evt.on(ScrollEvent.CHANGED, (v) => {
            console.log('scroll', v);
            for (var i = 0; i < this.stackerArr.length; i++) {
                var s: Stacker = this.stackerArr[i];
                s.scroll(v)
            }
            this.timestampBar.scroll(v)
        })

        this.stackerCtn = new PIXI.Container()
        this.stackerCtn.y = this.hScroller.height
        this.addChild(this.stackerCtn)
        this.stackerArr = []

        this.vScroller = new Scroller('v', 300, 0, 100)
        this.vScroller.x = 200
        this.vScroller.y = this.hScroller.height
        this.vScroller.evt.on(ScrollEvent.CHANGED, (v) => {

        })
        this.addChild(this.vScroller)

        this.addChild(this.timestampBar)

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
        // if(this.height)
        // if (s)
        //     this.vScroller.setMax((s.height + 1) * this.stackerArr.length)
    }

    resize(width, height) {
        this.vScroller.setMax(height - this.hScroller.height)
        this.hScroller.setMax(width - 200 - 15)
        this.timestampBar.resize(width - 200 - 15, height)
    }
}