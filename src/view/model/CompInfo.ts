import { walkDir } from '../../utils/NodeFunc';
import { cmd } from './Command';
import { basename } from 'path';
import { FrameData } from './FrameInfo';
import { CompInfoEvent, FrameTimerEvent } from '../const';
import { FrameTimer } from './FrameTimer';
import { TrackData, TrackInfo } from './TrackInfo';
import { EventDispatcher } from '../../utils/EventDispatcher';

class CompositionData {
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
        this._compData.name = v
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
    newTrack(filename, callback?) {
        let tInfo = new TrackInfo()
        this.trackInfoArr.push(tInfo)
        tInfo.name('track#' + this.trackInfoArr.length)
        cmd.emit(CompInfoEvent.NEW_TRACK, tInfo)

        const path = require('path')
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
}