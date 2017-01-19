import { TrackInfoEvent } from '../const';
import { cmd } from './Command';
import { FrameData, FrameInfo } from './FrameInfo';
import { EventDispatcher } from '../../utils/EventDispatcher';

enum TrackLoopType {
    NONE, HOLD, REPEAT
}
enum TrackType {
    IMAGE = 1,
    COMP,
    AUDIO,
}
enum ImageTrackActType {
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
    constructor() {
        super()
        this._trackData = new TrackData;
        this.frameInfoArr = [];
        this.removedFrameArr = [];
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

    loopType(v?) {
        if (v != undefined)
            this._trackData.loopType = v;
        return this._trackData.loopType;
    }

    start(v?) {
        if (v != undefined)
            this._trackData.start = v
        return this._trackData.start
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
}