import { ProjectInfo } from './model/ProjectInfo';
import { EventDispatcher } from '../utils/EventDispatcher';
import { ScrollEvent, ViewEvent } from './const';
import { TimestampBar, LayerTracker } from './LayerTracker';
import { Splitter } from './components/Splitter';
export class Animk extends EventDispatcher {
    projInfo:ProjectInfo
    vSplitter: Splitter
    tracker: LayerTracker
    frameWidth = 40
    init(stage: PIXI.Container) {
        this.projInfo = new ProjectInfo()
        let vs = new Splitter('v', 1600, 1000)
        this.vSplitter = vs
     
        stage.addChild(vs)

        let c1 = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, 400, 200)
        vs.setChild(c1)

        // let c2 = new PIXI.Graphics().beginFill(0xffff00).drawRect(0,0,400,200)
        // vs.setChild(c2)
        let tk = new LayerTracker()
        this.tracker = tk
        vs.setChild(tk)
        vs.setBarY(720)
        vs.bar.addChild(tk.timestampBar)
        this.vSplitter.evt.on(ScrollEvent.CHANGED, (vs: Splitter) => {
            this.tracker.resize(vs.width, vs.child2Space)
        })

        this.initMouse()
        this.test()
    }

    initMouse() {
        document.onmouseup = (e) => {
            e['mx'] = e.clientX
            e['my'] = e.clientY
            this.emit(ViewEvent.MOUSE_UP, e)
        }
    }

    test() {
        // for (var i = 0; i < 1; i++) {
        //     this.tracker.newStacker()
        // }
        this.projInfo.curComp.newTrack('D:\\lsj\\rkb2017\\军哥\\cut3\\jg020114.838.png')
        this.tracker.vScroller.setMax(350)
        this.tracker.vScroller.evt.on(ScrollEvent.CHANGED, (v) => {
            console.log('scroll changed', v);
        })
    }
}

export let animk = new Animk()