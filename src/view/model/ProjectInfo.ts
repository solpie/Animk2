import { jsonfile } from '../../utils/JSONFile';
import { FrameData } from './FrameInfo';
import { TrackData, TrackInfo } from './TrackInfo';
import { CompInfoEvent } from '../const';
import { CompInfo, CompositionData } from './CompInfo';
import { EventDispatcher } from '../../utils/EventDispatcher';
const M_path = require('path')

export class ProjectInfoEvent {
    static NEW_PROJ: string = "NEW_PROJ";
}

export class ProjectInfo extends EventDispatcher {
    comps: Array<CompInfo> = [];
    curComp: CompInfo;
    version: string = '0.1.0';
    saveFilename: string;
    constructor() {
        super()
    }

    /////////////////////// open project
    open(path) {
        console.log(this, "open project", path);
        jsonfile.readFile(path, null, (err, projData) => {
            console.log(this, "open project ver:", projData.linAnil.version);
            this.version = projData.linAnil.version;

            for (var i = 0; i < projData.linAnil.composition.length; i++) {
                var compData: CompositionData = projData.linAnil.composition[i];
                var compInfo: CompInfo = this.newComp(compData.width, compData.height, compData.framerate);
                for (var j = 0; j < compData.tracks.length; j++) {
                    var trackData = compData.tracks[j];
                    var path = trackData.path;
                    for (var k = 0; k < trackData.frames.length; k++) {
                        var frameData: FrameData = trackData.frames[k];
                        frameData.filename = M_path.join(path, frameData.filename);
                    }
                    compInfo.newTrackByTrackData(trackData)
                }
            }
        });
    }

    save(path) {
        this.saveFilename = path;
        var projData = {
            linAnil: {
                version: this.version,
                setting: {
                    tmp: "c:/tmp",
                },
                composition: []
            }
        };
        for (var i = 0; i < this.comps.length; i++) {
            var compInfo: CompInfo = this.comps[i];
            if (!compInfo)
                continue;
            var compData: CompositionData = {
                name: compInfo.name(),
                framerate: compInfo.framerate,
                framewidth: compInfo.frameWidth,
                height: compInfo.height,
                width: compInfo.width,
                tracks: []
            };
            projData.linAnil.composition.push(compData);
            for (var j = 0; j < compInfo.trackInfoArr.length; j++) {
                var trackInfo: TrackInfo = compInfo.trackInfoArr[j];
                if (!trackInfo)
                    continue;
                console.log(this, "get TrackData", j, trackInfo.trackData());
                var trackData: TrackData = TrackData.clone(trackInfo.trackData());
                compData.tracks.push(trackData);
                for (var k = 0; k < trackData.frames.length; k++) {
                    var frameData: FrameData = trackData.frames[k];
                    if (!frameData)
                        continue;
                    frameData.filename = M_path.basename(frameData.filename);
                }
            }
        }

        jsonfile.writeFile(path, projData, null, function (err) {
            //console.error(err)
        });

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