import { PngMaker } from '../utils/png/PngMaker';
import { cmd } from './model/Command';
import { Viewport } from './components/Viewport/Viewport';
import { LayerTracker } from './LayerTrack/LayerTracker';
import { ProjectInfo } from './model/ProjectInfo';
import { EventDispatcher } from '../utils/EventDispatcher';
import { CompInfoEvent, InputEvent, BaseEvent } from './const';
import { Splitter } from './components/Splitter';
export class Animk extends EventDispatcher {
    projInfo: ProjectInfo
    vSplitter: Splitter
    tracker: LayerTracker
    viewport: Viewport
    // frameWidth = 40
    init(stage: PIXI.Container) {
        this.projInfo = new ProjectInfo()
        let vs = new Splitter('v', 1600, 1000)
        this.vSplitter = vs

        stage.addChild(vs)

        // let c1 = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, 400, 200)
        // vs.setChild(c1)
        let vp = new Viewport()
        vs.setChild(vp)
        // let c2 = new PIXI.Graphics().beginFill(0xffff00).drawRect(0,0,400,200)
        // vs.setChild(c2)
        let tk = new LayerTracker()
        this.tracker = tk
        vs.setChild(tk)
        vs.setBarY(720)
        vs.bar.addChild(tk.timestampBar)
        this.vSplitter.evt.on(BaseEvent.CHANGED, (vs: Splitter) => {
            this.tracker.resize(vs.width, vs.child2Space)
        })

        this.initMouse()
        this.initEvent()
        this.onload()
        this.test()
    }
    onload() {
        this.projInfo.curComp.setCursor(1)
    }
    initEvent() {
        // this.projInfo.curComp.removeAll()
        this.on(InputEvent.KEY_DOWN, (e) => {
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
        window.onkeydown = (e) => {
            this.emit(InputEvent.KEY_DOWN, e)
        }
    }

    test() {
        //todo: ctrl + drag frame :hold frame

        let p = new PngMaker()
        p.createPng(512, 512, 'd:\\test.png', () => {
            
        })
        // var addon = require('addon/psd')
        // console.log(addon.hello()); // 'world'
        // for (var i = 0; i < 1; i++) {
        //     this.tracker.newStacker()
        // }
        // for (var p of ['D:\\lsj\\rkb2017\\军哥\\cut3\\jg020114.838.png', 'D:\lsj\rkb2017\军哥\reto\101.png']) {
        // this.projInfo.curComp.newTrack(p);
        // }
        // var wintab = require('./build/wintab');
        var wintab = require('addon/node-wintab');
        setInterval(function () {
            console.log(wintab.allData());
        }, 100);
        this.projInfo.curComp.newTrack('D:\\lsj\\rkb2017\\军哥\\cut3\\jg020114.838.png');

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