import { getPixelBufFromImg } from '../utils/PixelBuf';
import { ImageLayerInfo } from './model/tm/ImageLayerInfo';
import { loadImg } from '../utils/JsFunc';
import { PaintView } from './components/Viewport/PaintView';
import { PaintCanvas } from './components/Viewport/PaintCanvas';
import { PngMaker } from '../utils/png/PngMaker';
import { Splitter } from './components/Splitter';
import { Viewport } from './components/Viewport/Viewport';
import { BaseEvent } from './const';
import { LayerTracker } from './LayerTrack/LayerTracker';
import { AppInfo } from './model/AppInfo';
import { input, InputEvent } from './../utils/Input';
import { ProjectInfo } from './model/ProjectInfo';
export class Animk extends PIXI.Container {
    projInfo: ProjectInfo
    vSplitter: Splitter
    tracker: LayerTracker
    viewport: Viewport
    ctn: PIXI.Container

    constructor() {
        super()

    }

    initUI() {
        let vs = new Splitter('v', 1600, 1000)
        this.vSplitter = vs
        this.addChild(vs)

        let vp = new Viewport()
        vs.setChild(vp)
        this.viewport = vp

        let tk = new LayerTracker()
        this.tracker = tk
        vs.setChild(tk)
        vs.setBarY(720)
        vs.bar.addChild(tk.timestampBar)
        this.vSplitter.on(BaseEvent.CHANGED, (vs: Splitter) => {
            this.tracker.resize(vs.width, vs.child2Space)
        })
    }

    init(stage: PIXI.Container, appInfo: AppInfo) {
        this.projInfo = appInfo.newProject()
        this.initUI()
        stage.addChild(this)

        this.initEvent()
        this.onload()
        this.test()
    }

    onload() {
        this.projInfo.curComp.setCursor(1)
    }
    initEvent() {
        input.on(InputEvent.KEY_DOWN, (e) => {
            let k = e.key
            let isCtrl = e.ctrlKey
            if (k == 'f') {
                this.projInfo.curComp.forward()
            }
            else if (k == 'd')
                this.projInfo.curComp.backward()

        })
    }

    test() {
        this.tracker.vScroller.setMax(350)
        this.tracker.vScroller.evt.on(BaseEvent.CHANGED, (v) => {
            console.log('scroll changed', v);
        })
    }
}

export let animk = new Animk()