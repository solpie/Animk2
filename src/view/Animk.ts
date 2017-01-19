import { EventDispatcher } from '../utils/EventDispatcher';
import { ScrollEvent, ViewEvent } from './const';
import { Tracker } from './Tracker';
import { Splitter } from './components/Splitter';
export class Animk extends EventDispatcher{
    vSplitter: Splitter
    tracker: Tracker

    init(stage: PIXI.Container) {
        let vs = new Splitter('v', 1600, 1000)
        this.vSplitter = vs
        stage.addChild(vs)

        let c1 = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, 400, 200)
        vs.setChild(c1)

        // let c2 = new PIXI.Graphics().beginFill(0xffff00).drawRect(0,0,400,200)
        // vs.setChild(c2)
        let tk = new Tracker()
        this.tracker = tk
        vs.setChild(tk)
        vs.setBarY(720)

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
            this.emit(ViewEvent.MOUSE_UP,e)
        }
    }

    test() {
        for (var i = 0; i < 5; i++) {
            this.tracker.newStacker()
        }
        this.tracker.vScroller.setMax(350)
        this.tracker.vScroller.evt.on(ScrollEvent.CHANGED, (v) => {
            console.log('scroll changed', v);
        })
    }
}

export let animk = new Animk()