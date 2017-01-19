import { LayerTracker } from './LayerTrack/LayerTracker';
import { ProjectInfo } from './model/ProjectInfo';
import { EventDispatcher } from '../utils/EventDispatcher';
import { ScrollEvent, InputEvent } from './const';
import { Splitter } from './components/Splitter';
export class Animk extends EventDispatcher {
    projInfo: ProjectInfo
    vSplitter: Splitter
    tracker: LayerTracker
    // frameWidth = 40
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
        this.initEvent()
        this.test()
    }
    initEvent() {
        // this.projInfo.curComp.removeAll()
        this.on(InputEvent.KEY_UP, (e) => {
            let k = e.key
            if (k == 'f') {
                console.log('forward');
                this.projInfo.curComp.forward()
            }
            else if (k == 'd')
                this.projInfo.curComp.backward()
        })
        // this.projInfo.curComp.on()
    }
    initMouse() {
        document.onmouseup = (e) => {
            e['mx'] = e.clientX
            e['my'] = e.clientY
            this.emit(InputEvent.MOUSE_UP, e)
        }
        window.onkeyup = (e) => {
            this.emit(InputEvent.KEY_UP, e)
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