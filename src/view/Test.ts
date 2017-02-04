import { Brush } from '../utils/anmkp/Brush';
import { Painter } from '../utils/anmkp/Painter';
import { input, InputEvent } from '../utils/Input';
import { PsdParser } from '../utils/psd2png/PsdParser';
import { CompInfoEvent } from './const';
import { ImageLayerInfo } from './model/tm/ImageLayerInfo';
import { getPixelBufFromImg } from '../utils/PixelBuf';
import { loadImg } from '../utils/JsFunc';
import { ProjectInfoEvent } from './model/ProjectInfo';
import { TweenEx } from '../utils/TweenEx';
import { appInfo, AppInfoEvent } from './model/AppInfo';
const testPainter = () => {

    let painter = new Painter()
    painter.lockHistory();
    painter.setCanvasSize(1280, 720, 0, 0)
    painter.addLayer();
    painter.fillLayer('#fff');
    painter.selectLayer(1);
    painter.unlockHistory();

    var brush = new Brush();
    brush.setSize(20);
    brush.setColor('#fff');
    brush.setSpacing(0.2);

    painter.setTool(brush);
    painter.setToolStabilizeLevel(10);
    painter.setToolStabilizeWeight(0.5);

    document.body.appendChild(painter.paintingCanvas)

    function getRelativePosition(absoluteX, absoluteY) {
        var rect = painter.paintingCanvas.getBoundingClientRect();
        return { x: absoluteX - rect.left, y: absoluteY - rect.top };
    }
    function canvasPointerMove(e) {
        // setPointerEvent(e);
        var pointerPosition = getRelativePosition(e.clientX, e.clientY);
        painter.move(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
    }
    function canvasPointerUp(e) {
        // setPointerEvent(e);
        var pointerPosition = getRelativePosition(e.clientX, e.clientY);
        // if (pointerEventsNone)
        //     canvasArea.style.setProperty('cursor', 'crosshair');
        painter.up(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
        if (e.pointerType === "pen" && e.button == 5)
            setTimeout(function () { painter.setPaintingKnockout(false) }, 30);
        input.del(InputEvent.MOUSE_MOVE,moveFuncId)
        input.del(InputEvent.MOUSE_UP,upFuncId)
        // document.removeEventListener('pointermove', canvasPointerMove);
        // document.removeEventListener('pointerup', canvasPointerUp);
    }
    var moveFuncId = null, upFuncId = null
    function canvasPointerDown(e) {
        // setPointerEvent(e);
        var pointerPosition = getRelativePosition(e.clientX, e.clientY);
        // if (pointerEventsNone)
        //     canvasArea.style.setProperty('cursor', 'none');
        // if (e.pointerType === "pen" && e.button == 5)
        //     painter.setPaintingKnockout(true);
        painter.down(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
        moveFuncId = input.on(InputEvent.MOUSE_MOVE, canvasPointerMove)
        upFuncId = input.on(InputEvent.MOUSE_UP, canvasPointerUp)
        // document.addEventListener('pointermove', canvasPointerMove);
        // document.addEventListener('pointerup', canvasPointerUp);
    }
    input.on(InputEvent.MOUSE_DOWN, canvasPointerDown)
}
export const initTest = () => {
    testPainter()
    appInfo.on(ProjectInfoEvent.NEW_PROJ, () => {
        // loadImg('d:\\test.png', (img) => {
        //     let t1 = new Date().getMilliseconds()
        //     let buf = getPixelBufFromImg(img)
        //     let w = img.width, h = img.height;
        //     let a: Array<ImageLayerInfo> = []
        //     let imgLayer = new ImageLayerInfo()
        //     imgLayer.width = w
        //     imgLayer.height = h
        //     imgLayer.pixels = buf
        //     a.push(imgLayer)
        //     ImageLayerInfo.png2psd(a, w,
        //         h, "rgba",
        //         'd:\\4.psd', (p) => {
        //             let t2 = new Date().getMilliseconds()
        //             console.log('psd4 cast time:', t2 - t1)
        //         });
        // })


        //psd parser
        // var psdParser = new PsdParser();
        // var psd = psdParser.parse('d:/3.psd');
        // let imgData = psd.getDescendants()[1].parseImageData();
        // console.log('imageData', imgData);
        // let cvs: any = document.getElementById('paintCanvas')
        // let ctx = cvs.getContext('2d');
        // let id = new ImageData(1280, 720)
        // let mc_px_data = new Uint8ClampedArray(imgData);
        // id.data.set(mc_px_data);
        // TweenEx.delayedCall(3000, () => {
        //     ctx.putImageData(id, 0, 0)
        // })
        ///////////


        // psd.getDescendants()[0].saveAsPng('d:/decode3.png', () => {
        // console.log(this, "psd2png", imageLayerInfo.filename);
        // imageLayerInfo.imageInfo.updateImg();
        // });
        appInfo.projectInfo.on(CompInfoEvent.NEW_COMP, () => {
            TweenEx.delayedCall(1000, () => {
                // appInfo.curComp().newTrack('D:/lsj/rkb2017/军哥/cut3/jg020114.924.png')
                // appInfo.curComp().newTrack('D:\lsj\rkb2017\军哥\reto\101.png')
            })
        })
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
        // TweenEx.delayedCall(2000, () => {
        //     this.tm.test()
        //     this.tm.test2()
        // })
    })
}
