import { ImageInfo } from '../ImageInfo';
import { appInfo } from '../AppInfo';
import { ImageTrackActType, TrackInfo } from '../TrackInfo';
import { TheMachineEvent, TrackInfoEvent } from '../../const';
import { FrameInfo } from '../FrameInfo';
import { EventDispatcher } from '../../../utils/EventDispatcher';
import { ImageLayerInfo } from './ImageLayerInfo';
import { POI } from './POI';

//the government has a secret system a machine,spies on you every hour of every day.
var exec = require('child_process').exec;

export class TheMachine extends EventDispatcher {
    ActFrameInfo: FrameInfo;
    watchPOIArr: Array<POI>;
    _updateCount: number = 0;//for clear cache
    _onWatchArr;

    constructor() {
        super();
        this.watchPOIArr = [];
        this._onWatchArr = {};
    }

    updateWatchArr() {
        this._updateCount++;
        for (var i = 0; i < this.watchPOIArr.length; i++) {
            var poi: POI = this.watchPOIArr[i];
            poi.psd2png();

        }
        appInfo.emit(TheMachineEvent.UPDATE_IMG);
    }

    _buildLayerArr(): Array<ImageLayerInfo> {
        var trackInfoArr = appInfo.curComp().getCompTrackInfoArr();
        var watchArr: Array<ImageLayerInfo> = [];
        for (var i = trackInfoArr.length - 1; i > -1; i--) {
            var trackInfo: TrackInfo = trackInfoArr[i];
            if (trackInfo.actType() != ImageTrackActType.NOEDIT) {
                // var imageInfo:ImageInfo = trackInfo.getCurImg(appInfo.projectInfo.curComp.getCursor());
                // if (imageInfo) {
                //     var isRef = (trackInfo.actType() == ImageTrackActType.REF);
                //     var imageLayerInfo = new ImageLayerInfo();
                //     imageLayerInfo.filename = imageInfo.filename;
                //     imageLayerInfo.opacity = trackInfo.opacity();
                //     imageLayerInfo.isRef = isRef;
                //     imageLayerInfo.imageInfo = imageInfo;
                //     watchArr.push(imageLayerInfo);
                // }
            }
        }
        return watchArr;
    }

    watchTrack(trackInfo: TrackInfo) {
        trackInfo.on(TrackInfoEvent.SET_TRACK_START, (trackInfo: TrackInfo) => {
            this._rebuild();
        });
        trackInfo.on(TrackInfoEvent.SET_ACT_TYPE, (trackInfo: TrackInfo) => {
            this._rebuild();
        });
        trackInfo.on(TrackInfoEvent.SET_ENABLE, (trackInfo: TrackInfo) => {
            this._rebuild();
        });
    }

    _rebuild() {
        for (var i = 0; i < this.watchPOIArr.length; i++) {
            var poi: POI = this.watchPOIArr[i];
            console.log(this, "_rebuild", poi.filename);
            poi.isBeingWatched = false;
        }
        this.watchPOIArr.length = 0;
    }

    _isExistPOI() {
        var basename = this._getCurFrameBaseName();
        for (var i = 0; i < this.watchPOIArr.length; i++) {
            var poi: POI = this.watchPOIArr[i];
            if (poi.basename == basename) {
                return poi;
            }
        }
        return null;
    }

    _getCurFrameBaseName() {
        return appInfo.curComp().name() + "frame" + appInfo.curComp().getCursor() + ".psd";
    }
    test2() {
        let t1 = new Date().getMilliseconds()
        var addon = require('addon/psd');
        addon.pngLoad("d:\\test.png", function (buf: ArrayBuffer, w, h) {
            var view = new Uint8Array(buf);
            // console.log(w, h, buf, view[0]);
            let a: Array<ImageLayerInfo> = []
            let imgLayer = new ImageLayerInfo()
            imgLayer.width = w
            imgLayer.height = h
            imgLayer.pixels = view
            a.push(imgLayer)
            ImageLayerInfo.png2psd(a, w,
                h, "rgba",
                'd:\\2.psd', (p) => {
                    let t2 = new Date().getMilliseconds()
                    console.log('addon cast time:', t2 - t1)
                });
        })
    }
    test() {
        // let t1 = new Date().getMilliseconds()

        // let a: Array<ImageLayerInfo> = []
        // let imgLayer = new ImageLayerInfo()
        // imgLayer.filename = "d:\\test.png"
        // imgLayer.load(() => {
        //     a.push(imgLayer)
        //     ImageLayerInfo.png2psd(a, imgLayer.width,
        //         imgLayer.height, "rgba",
        //         'd:\\3.psd', (p) => {
        //             let t2 = new Date().getMilliseconds()
        //             console.log('cast time:', t2 - t1)
        //         });
        // })
    }
    watchCurFrame() {
        var existPOI = this._isExistPOI();
        if (existPOI) {
            console.log(this, "cur frame exist");
            this.open(existPOI.filename);
            return;
        }

        // var arrayImageLayerInfo: Array<ImageLayerInfo> = this._buildLayerArr();
        // if (arrayImageLayerInfo.length) {
        //     const path1 = require('path')
        //     var poi = new POI();
        //     var basename = this._getCurFrameBaseName();
        //     poi.basename = basename;
        //     poi.filename = path1.join(appInfo.settingInfo.tmpPath(), basename);
        //     this.watchPOIArr.push(poi);
        //     var parsingCount = 0;
        //     var onParsed = () => {
        //         parsingCount++;
        //         if (parsingCount < arrayImageLayerInfo.length)
        //             arrayImageLayerInfo[parsingCount].load(onParsed);
        //         else {
        //             console.log(this, "new poi");
        //             ImageLayerInfo.png2psd(arrayImageLayerInfo, appInfo.projectInfo.curComp.width,
        //                 appInfo.projectInfo.curComp.height, "rgba",
        //                 poi.filename, (p) => {
        //                     this.open(p);
        //                     this.watchPOI(poi);
        //                 });
        //         }
        //     };
        //     poi.imageLayerInfoArr = arrayImageLayerInfo;
        //     arrayImageLayerInfo[0].load(onParsed);
        // }
    }

    onPOIchange(path) {
        for (var i = 0; i < this.watchPOIArr.length; i++) {
            var poi: POI = this.watchPOIArr[i];
            if (poi.isBeingWatched && poi.basename == path) {
                this._updateCount++;
                poi.psd2png();
            }
        }
        console.log(this, "onPOIchange", path);
    }

    watchPOI(poi: POI) {
        //fs.unwatchFile
        const fs = require("fs")
        var path = poi.filename;
        poi.isBeingWatched = true;
        console.log(this, "watchPOI", path);
        if (!this._onWatchArr[path]) {
            fs.watch(path, (event, filename) => {
                console.log('event is: ' + event);
                if (filename) {
                    console.log('filename provided: ' + filename);
                    if (event == "change") {
                        this.onPOIchange(filename);
                    }
                } else {
                    console.log('filename not provided');
                }
            });
            this._onWatchArr[path] = true;
        }
    }


    open(path: string) {
        // if (appInfo.settingInfo.drawApp1Path()) {

        //     path = path.replace("/", "\\");
        //     console.log(this, "open:", path);
        //     var appPath = '"' + appInfo.settingInfo.drawApp1Path().replace("/", "\\") + '" ';
        //     exec(appPath + path, function (error, stdout, stderr) {
        //         //exec('"C:\\Program Files\\CELSYS\\CLIP STUDIO\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe" ' + path, function (error, stdout, stderr) {
        //         if (stdout) {
        //             console.log('stdout: ' + stdout);
        //         }
        //         if (stderr) {
        //             console.log('stderr: ' + stderr);
        //         }
        //         if (error !== null) {
        //             console.log('Exec error: ' + error);
        //         }
        //     });
        // }
        // else {
        //     cmd.emit(CommandId.ShowSettingWin);
        // }

    }
}