import { CompInfoEvent } from '../const';
import { CompInfo } from './CompInfo';
import { EventDispatcher } from '../../utils/EventDispatcher';
export class ProjectInfo extends EventDispatcher {
    comps: Array<CompInfo> = [];
    curComp: CompInfo;
    version: string = '0.1.0';
    saveFilename: string;
    constructor() {
        super()
        this.newComp(1280, 720, 30)
    }
    frameWidth() {
        return this.curComp.frameWidth
    }
    newComp(width, height, framerate): CompInfo {
        var compInfo: CompInfo = new CompInfo(width, height, framerate);
        this.curComp = compInfo;
        this.comps.push(compInfo);
        compInfo.name("Comp" + this.comps.length);
        console.log(this, "new CompInfo");
        this.emit(CompInfoEvent.NEW_COMP, compInfo);
        return compInfo;
    }
}