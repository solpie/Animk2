import { SettingInfo } from './SettingInfo';
import { prop } from '../../utils/JsFunc';
import { ProjectInfo, ProjectInfoEvent } from './ProjectInfo';
import { EventDispatcher } from '../../utils/EventDispatcher';
class AppData {
    winWidth:number = 1660;
    winHeight:number = 1024;
}
export class AppInfo extends EventDispatcher {
    projectInfo:ProjectInfo;
    // tm:TheMachine;
    settingInfo:SettingInfo;
    appData:AppData;
    mouseX:number;
    mouseY:number;

    constructor() {
        super();
        this.appData = new AppData();
        // this.tm = new TheMachine();
        this.settingInfo = new SettingInfo();
    }

    width(v?) {
        return prop(this.appData, "winWidth", v);
    }

    height(v?) {
        return prop(this.appData, "winHeight", v);
    }

    newProject() {
        this.projectInfo = new ProjectInfo();
        this.emit(ProjectInfoEvent.NEW_PROJ);
        this.projectInfo.newComp(1280, 720, 24);
        this.projectInfo.curComp.setCursor(1);
        return this.projectInfo
    }

    openProject(path) {
        this.projectInfo = new ProjectInfo();
        this.emit(ProjectInfoEvent.NEW_PROJ);
        this.projectInfo.open(path);

        //this.projectInfo.curComp.setCursor(1);
    }

    frameWidth() {
        return this.projectInfo.curComp.frameWidth;
    }

    curComp() {
        return this.projectInfo.curComp;
    }
}

export const appInfo = new AppInfo()