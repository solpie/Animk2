import { PsdParser } from '../utils/psd2png/PsdParser';
import { CompInfoEvent } from './const';
import { ImageLayerInfo } from './model/tm/ImageLayerInfo';
import { getPixelBufFromImg } from '../utils/PixelBuf';
import { loadImg } from '../utils/JsFunc';
import { ProjectInfoEvent } from './model/ProjectInfo';
import { TweenEx } from '../utils/TweenEx';
import { appInfo, AppInfoEvent } from './model/AppInfo';
export const initTest = () => {
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

        var psdParser = new PsdParser();
        var psd = psdParser.parse('d:/3.psd');
        let imgData = psd.getDescendants()[1].parseImageData();
        console.log('imageData', imgData);
        let cvs: any = document.getElementById('paintCanvas')
        let ctx = cvs.getContext('2d');
        let id = new ImageData(1280, 720)
        let mc_px_data = new Uint8ClampedArray(imgData);
        id.data.set(mc_px_data);
        ctx.putImageData(id, 0, 0)
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
