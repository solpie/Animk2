import { CompInfo } from './CompInfo';
import { TweenEx } from '../../utils/TweenEx';
import { TheMachine } from './tm/TheMachine';
import { SettingInfo } from './SettingInfo';
import { prop } from '../../utils/JsFunc';
import { ProjectInfo, ProjectInfoEvent } from './ProjectInfo';
import { EventDispatcher } from '../../utils/EventDispatcher';
class AppData {
    winWidth: number = 1660;
    winHeight: number = 1024;
}
export const AppInfoEvent = {
    Inited: "AppInfo()",
}
const fs = require('fs')
export class AppInfo extends EventDispatcher {
    //.conf file js object
    conf: any;

    projectInfo: ProjectInfo;
    tm: TheMachine;
    settingInfo: SettingInfo;
    appData: AppData;
    mouseX: number;
    mouseY: number;
    constructor() {
        super();
        this.initConf(() => {
              this.appData = new AppData();
        this.tm = new TheMachine();
        this.settingInfo = new SettingInfo();
        this.emit(AppInfoEvent.Inited)
        })
    }

    initConf(callback) {
        fs.readFile('resources/.conf', 'utf8', (err, data) => {
            this.conf = JSON.parse(data)
            console.log(data,this.conf.version)
            callback()
        });
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
        this.projectInfo.newComp(1280, 720, 30);
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

    curComp(): CompInfo {
        return this.projectInfo.curComp;
    }
}

export const appInfo = new AppInfo()