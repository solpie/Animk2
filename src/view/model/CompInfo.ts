import { ImageLayerInfo } from './tm/ImageLayerInfo';
import { getPixelBufFromImg } from '../../utils/PixelBuf';
import { imgCache } from './ImageCache';
import { prop } from '../../utils/JsFunc';
import { walkDir } from '../../utils/NodeFunc';
import { cmd } from './Command';
import { basename } from 'path';
import { FrameData } from './FrameInfo';
import { CompInfoEvent, FrameTimerEvent, TrackInfoEvent } from '../const';
import { FrameTimer } from './FrameTimer';
import { TrackData, TrackInfo, TrackType } from './TrackInfo';
import { EventDispatcher } from '../../utils/EventDispatcher';
const path = require('path')

export class CompositionData {
    name: string;
    framerate: number;
    framewidth: number;
    height: number;
    width: number;
    tracks: Array<TrackData>;

    static clone(val: CompositionData) {
        //todo clone this
    }
}
export class CompInfo extends EventDispatcher {
    framerate: number = 24;
    _compTrackInfoArr: Array<TrackInfo>;

    trackInfoArr: Array<TrackInfo>;
    frameWidth: number = 40
    width: number;
    height: number;
    _frameTimer: FrameTimer;
    _compData: CompositionData;
    _cursorPos: number = 1;
    _maxPos: number = 0;

    constructor(width, height, framerate) {
        super();
        this._compData = new CompositionData;
        this.width = width;
        this.height = height;
        this.framerate = framerate;
        this.trackInfoArr = [];

        this._frameTimer = new FrameTimer(framerate);
        this._frameTimer.on(FrameTimerEvent.TICK, () => {
            this.onFrameTimerTick();
        });
    }

    onFrameTimerTick() {
        this.forward();
    }

    forward() {
        if (this._cursorPos >= this._maxPos)
            this.setCursor(1);
        else
            this.setCursor(this._cursorPos + 1);
    }

    backward() {
        if (this._cursorPos > 1) {
            this.setCursor(this._cursorPos - 1);
        }
    }

    setCursor(framePos) {
        this._cursorPos = framePos;
        this.emit(CompInfoEvent.UPDATE_CURSOR, this._cursorPos);
    }

    getCursor() {
        return this._cursorPos
    }

    name(v?) {
        return prop(this._compData, 'name', v)
        // this._compData.name = v
    }
    // walkFile(start) {
    //     var fileCount = 0,
    //     fileArr = []
    //     const path =  require('path')
    //     var f = path.join(dir, start + '.' + a[1])
    //     fs.exists(f, (exists) => {
    //         if (exists) {
    //             fileArr.push(f)
    //             tInfo.pushFrame(f)
    //             fileCount++
    //             this.updateMaxPos(fileCount)
    //             this.walkFile(start + 1)
    //         }
    //         else {
    //             if (fileArr.length == 0)//not name by frame
    //             {
    //                 let fa = walkDir(dir, (f) => {
    //                     fileArr.push(f)
    //                     tInfo.pushFrame(f)
    //                     fileCount++
    //                     this.updateMaxPos(fileCount)
    //                 })
    //                 cmd.emit(CompInfoEvent.READ_DIR)
    //                 // if (callback)
    //                 //     callback()
    //                 // console.log('fa', fa);

    //             }
    //             else {
    //                 cmd.emit(CompInfoEvent.READ_DIR)
    //             }
    //             // else if (callback) {
    //             //     callback()
    //             // }
    //             // console.log('fileArr', fileArr);
    //         }
    //     });
    // }
    newRetoTrack(trackPath,frameCount) {
        let trkName = 'track#' + this.trackInfoArr.length
        
        let cachePath = path.join(trackPath, 'cache', trkName)
        require('child_process').exec('mkdir ' + cachePath)
    }
    newTrack(filename, callback?) {
        let tInfo = new TrackInfo()
        this.trackInfoArr.push(tInfo)

        tInfo.on(TrackInfoEvent.SET_TRACK_START, (t: TrackInfo) => {
            this.emit(CompInfoEvent.UPDATE_CURSOR, this.getCursor())
            console.log('track end:', t)
            this.updateMaxPos(t.end)
        })
        tInfo.on(TrackInfoEvent.SET_ENABLE, () => {
            this.emit(CompInfoEvent.UPDATE_CURSOR, this.getCursor())
        })
        tInfo.on(TrackInfoEvent.SET_FRAME_HOLD, (trackInfo: TrackInfo) => {
            this.updateMaxPos(trackInfo.lengthFrame)
        })

        tInfo.name('track#' + this.trackInfoArr.length)
        cmd.emit(CompInfoEvent.NEW_TRACK, tInfo)

        let basename = path.basename(filename)
        let dir = path.dirname(filename)
        console.log('basename', basename);
        let a = basename.split('.')
        const fs = require('fs')
        let fileArr = []
        var fileCount = 0


        let fa = walkDir(dir, (f) => {
            fileArr.push(f)
            tInfo.pushFrame(f)
            fileCount++
            this.updateMaxPos(fileCount)
        })
        cmd.emit(CompInfoEvent.READ_DIR)
        //
        // let walk = (start) => {
        //     var f = path.join(dir, start + '.' + a[1])
        //     fs.exists(f, (exists) => {
        //         if (exists) {
        //             fileArr.push(f)
        //             tInfo.pushFrame(f)
        //             fileCount++
        //             this.updateMaxPos(fileCount)
        //             walk(start + 1)
        //         }
        //         else {
        //             if (fileArr.length == 0)//not name by frame
        //             {
        //                 let fa = walkDir(dir, (f) => {
        //                     fileArr.push(f)
        //                     tInfo.pushFrame(f)
        //                     fileCount++
        //                     this.updateMaxPos(fileCount)
        //                 })
        //                 cmd.emit(CompInfoEvent.READ_DIR)
        //                 // if (callback)
        //                 //     callback()
        //                 // console.log('fa', fa);

        //             }
        //             else {
        //                 cmd.emit(CompInfoEvent.READ_DIR)
        //             }
        //             // else if (callback) {
        //             //     callback()
        //             // }
        //             // console.log('fileArr', fileArr);
        //         }
        //     });
        // }
        // walk(Number(a[0]))

        // var trackData: TrackData = new TrackData();
        // trackData.frames = this.walk(path);
        // if (isdef(name))
        //     trackData.name = name;
        // else
        //     trackData.name = this.newTrackName();//
        // trackData.path = path;
        // trackData.start = 1;
        // this.newTrackByTrackData(trackData);
    }

    updateMaxPos(v) {
        if (v > this._maxPos)
            this._maxPos = v
        console.log('maxPos', this._maxPos);
    }

    makePsd(callback?, frame?) {
        if (!frame)
            frame = this._cursorPos;
        let imgArr = []
        let t1 = new Date().getMilliseconds()
        let a: Array<ImageLayerInfo> = []
        for (var trackInfo of this.trackInfoArr) {
            var filename = trackInfo.getFrameByCursor(frame)
            let img = imgCache.getImg(filename)
            if (img) {
                let buf = imgCache.getBuf(filename)
                let w = img.width, h = img.height;
                let imgLayer = new ImageLayerInfo()
                imgLayer.width = w
                imgLayer.height = h
                imgLayer.pixels = buf
                a.push(imgLayer)
            }
        }
        ImageLayerInfo.png2psd(a, this.width,
            this.height, "rgba",
            'd:\\4.psd', (p) => {
                let t2 = new Date().getMilliseconds()
                console.log('psd4 cast time:', t2 - t1)
            });
    }

    newTrackByTrackData(trackData: TrackData) {
        var trackInfo: TrackInfo = new TrackInfo(trackData);
        if (trackData.type == TrackType.AUDIO) {

        }
        else {
            // trackInfo.newImage(trackData.frames);
        }
        //trackInfo.path(trackData.path);
        //trackInfo.start(trackData.start);
        trackInfo.idx2(this.trackInfoArr.length);
        trackInfo.layerIdx(this.trackInfoArr.length);
        this.appendTrackInfo(trackInfo);
        this.emit(CompInfoEvent.NEW_TRACK, trackInfo);
    }
    appendTrackInfo(trackInfo: TrackInfo) {
        this.trackInfoArr.push(trackInfo);
        this._updateCompTrackArr();
    }

    _updateCompTrackArr() {
        var compare = function (prop) {
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };
        var a = [];
        this.trackInfoArr.map((tInfo) => {
            if (tInfo)
                a.push(tInfo);
        });
        a.sort(compare("_layerIdx"));
        this._compTrackInfoArr = a;
    }

    getCompTrackInfoArr() {
        if (!this._compTrackInfoArr)
            this._updateCompTrackArr();
        return this._compTrackInfoArr;
    }

}