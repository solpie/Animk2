import { prop } from '../../utils/JsFunc';
import { ImageInfo } from './ImageInfo';
import { TrackInfoEvent } from '../const';
import { cmd } from './Command';
import { FrameData, FrameInfo } from './FrameInfo';
import { EventDispatcher } from '../../utils/EventDispatcher';

export enum TrackLoopType {
    NONE, HOLD, REPEAT
}
export enum TrackType {
    IMAGE = 1,
    COMP,
    AUDIO,
}
export enum ImageTrackActType {
    NORMAL = 1,//in psd ,render
    REF,// in psd ,no render
    NOEDIT,//not in psd in psd but render
}
export class TrackData {//for save
    name: string;
    opacity: number = 1;
    enable: boolean = true;
    type: number = TrackType.IMAGE;
    start: number = 1;
    act: number = ImageTrackActType.NORMAL;
    loopType: number = TrackLoopType.HOLD;
    end: number = 1;
    path: string;
    frames: Array<FrameData>;

    static clone(val: TrackData) {
        var td = new TrackData();
        for (var p in val) {
            if (p != "frames")
                td[p] = val[p];
            else {
                //console.log(this, "no clone for Array");
            }
        }
        td.frames = [];
        for (var i = 0; i < val.frames.length; i++) {
            td.frames.push(FrameData.clone(val.frames[i]))
        }
        return td;
    }
}
export class TrackInfo extends EventDispatcher {
    _idx: number;
    _selectFrameIdx: number;
    frameInfoArr: Array<FrameInfo>;
    _trackData: TrackData;
    isActive: boolean;
    isSelected: boolean;

    _hold: number = 1;
    _isSel: Boolean = false;
    removedFrameArr: Array<FrameInfo>;
    _layerIdx: number;
    constructor(trackData?: TrackData) {
        super()
        trackData ? this._trackData = trackData : this._trackData = new TrackData;
        this.frameInfoArr = [];
        this.removedFrameArr = [];
    }

    idx2(v?) {
        return prop(this, '_idx', v)
    }
    
    layerIdx(v?) {
        return prop(this, "_layerIdx", v);
    }

    name(v?) {
        if (v != undefined)
            this._trackData.name = v
        return this._trackData.name
    }

    pushFrame(filename) {
        let frameInfo = new FrameInfo(filename)
        this.frameInfoArr.push(frameInfo)
        frameInfo.setIdx(this.frameInfoArr.length)
        frameInfo.setStart(this.frameInfoArr.length)
        this.emit(TrackInfoEvent.PUSH_FRAME, frameInfo)
    }
    _loadCount;

    onImgLoaded() {
        //console.log(this, "load test");
        //img.removeEventListener("load", this._onLoadFunc);
        this._loadCount--;
        if (this._loadCount > 0) {
        }
        else {
            this.emit(TrackInfoEvent.LOADED);
        }
    }
    
    newImage(frameDataArr: Array<FrameData>) {
        var newFrame;
        var frameData: FrameData;
        this._loadCount = frameDataArr.length;
        var holdCount = frameDataArr.length;
        for (var i = 0; i < frameDataArr.length; i++) {
            frameData = frameDataArr[i];
            newFrame = new FrameInfo(frameData.filename);
            //todo delete img listener
            newFrame.imageInfo.img.addEventListener("load", () => {
                this.onImgLoaded();
            });
            if (frameData.start) {
                newFrame.setStart(frameData.start);
                newFrame.setHold(frameData.hold);
                holdCount += (frameData.hold - 1);
            }
            else {
                newFrame.setStart(i + 1);
                newFrame.setHold(1);
            }
            newFrame.setIdx(this.frameInfoArr.length);
            this.frameInfoArr.push(newFrame);
        }
        this._hold = holdCount;
    }

    loopType(v?) {
        if (v != undefined)
            this._trackData.loopType = v;
        return this._trackData.loopType;
    }

    actType(v?) {
        if (v != undefined) {
            this._trackData.act = v;
            this.emit(TrackInfoEvent.SET_ACT_TYPE, v)
        }
        return this._trackData.act;
    }

    opacity(v?) {
        if (v != undefined) {
            this._trackData.opacity = v;
            this.emit(TrackInfoEvent.SET_OPACITY, v)
        }
        return this._trackData.opacity;
    }

    start(v?) {
        if (v != undefined) {
            this._trackData.start = v
            this.emit(TrackInfoEvent.SET_TRACK_START, v)
        }
        return this._trackData.start
    }

    enable(v?) {
        if (v != undefined) {
            this._trackData.enable = v
            this.emit(TrackInfoEvent.SET_ENABLE, v)
        }
        return this._trackData.enable
    }

    getFrameByCursor(frameIdx) {
        frameIdx -= this.start() - 1;
        for (var i = 0; i < this.frameInfoArr.length; i++) {
            var frameInfo: FrameInfo = this.frameInfoArr[i];
            if (frameInfo.getStart() <= frameIdx && frameInfo.getEnd() >= frameIdx) {
                return frameInfo.filename;
            }
        }
        if (frameIdx > frameInfo.getEnd() && this.loopType() == TrackLoopType.HOLD) {
            return frameInfo.filename;
        }
        return null;
    }
    trackData(): TrackData {
        return this._trackData;
    }

    getCurImg(frameIdx: number) {
        //todo clean
        return this.getFrameByCursor(frameIdx)
    }
}