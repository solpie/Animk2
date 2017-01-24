import { Scroller } from './../components/Scroller';
import { BaseEvent, CompInfoEvent } from './../const';
import { cmd } from './../model/Command';
import { TrackInfo } from './../model/TrackInfo';
import { Stacker } from './Stacker';
import { TimestampBar } from './TimestampBar';
export class LayerTracker extends PIXI.Container {
    timestampBar: TimestampBar
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
        this.hScroller.evt.on(BaseEvent.CHANGED, (v) => {
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
        this.vScroller.evt.on(BaseEvent.CHANGED, (v) => {

        })
        this.addChild(this.vScroller)

        this.addChild(this.timestampBar)
        this.initCmd()
    }

    initCmd() {
        cmd.on(CompInfoEvent.NEW_TRACK, (tInfo: TrackInfo) => {
            let s = this.newStacker(tInfo)
            // s.load(filePath)
        })

        // cmd.emit(CompInfoEvent.NEW_TRACK, tInfo)

    }

    newStacker(trackInfo: TrackInfo): Stacker {
        let s = new Stacker(trackInfo)
        this.stackerCtn.addChild(s)
        this.stackerArr.push(s)
        this._updateVPos()
        return s
    }

    _updateVPos() {
        var s;
        for (var i = 0; i < this.stackerArr.length; i++) {
            s = this.stackerArr[this.stackerArr.length - 1 - i];
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