import { prop } from '../../utils/JsFunc';
import { EventDispatcher } from '../../utils/EventDispatcher';
class SettingData {
    tmpPath:string = "c:/tmp";
    drawApp1Path:string = "C:\\Program Files\\CELSYS\\CLIP STUDIO 1.5\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe";
    drawApp2Path:string = "";
}
export class SettingInfoEvent {
    static SET_TMP_PATH: string = "SET_TMP_PATH";
    static SET_DRAW_APP1: string = "SET_DRAW_APP1";
    static SET_DRAW_APP2: string = "SET_DRAW_APP2";
}

export class SettingInfo extends EventDispatcher {
    settingData:SettingData;

    constructor() {
        super();
        this.settingData = new SettingData();
    }

    tmpPath(v?) {
        return prop(this.settingData, "tmpPath", v, ()=> {
            this.emit(SettingInfoEvent.SET_TMP_PATH)
        })
    }

    drawApp1Path(v?) {
        return prop(this.settingData, "drawApp1Path", v, ()=> {
            this.emit(SettingInfoEvent.SET_DRAW_APP1)
        })
    }
}