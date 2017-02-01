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
        
        //todo: ctrl + drag frame :hold frame

        // let p = new PngMaker()
        // p.createPng(512, 512, 'd:\\test.png', () => {

        // })
        // var addon = require('addon/psd')
        // console.log(addon.hello()); // 'world'
        // for (var i = 0; i < 1; i++) {
        //     this.tracker.newStacker()
        // }
        // for (var p of ['D:\\lsj\\rkb2017\\军哥\\cut3\\jg020114.838.png', 'D:\lsj\rkb2017\军哥\reto\101.png']) {
        // this.projInfo.curComp.newTrack(p);
        // }
        // var wintab = require('./build/wintab');
        // var wintab = require('addon/node-wintab');
        // setInterval(function () {
        //     console.log(wintab.allData());
        // }, 100);
        // this.projInfo.curComp.newTrack('C:\projects\Animk2\test\test30\01.png');

        // let a = ['D:\\lsj\\rkb2017\\军哥\\cut3\\jg020114.838.png', 'D:\lsj\rkb2017\军哥\reto\101.png']
        // let loadTrack = (pathArr: Array<string>) => {
        //     let p = pathArr.shift()
        //     if (p) {
        //         let fid = cmd.on(CompInfoEvent.READ_DIR, () => {
        //             cmd.del(CompInfoEvent.READ_DIR, fid)
        //             loadTrack(pathArr)
        //         })
        //         this.projInfo.curComp.newTrack(p);
        //     }
        // }
        // loadTrack(a)

        this.tracker.vScroller.setMax(350)
        this.tracker.vScroller.evt.on(BaseEvent.CHANGED, (v) => {
            console.log('scroll changed', v);
        })
    }
}

export let animk = new Animk()