import { imgCache } from '../../model/ImageCache';
import { loadImg } from '../../../utils/JsFunc';
import { imgToTex, PIXI_RECT } from '../../../utils/PixiEx';
import { CompInfoEvent, ViewConst } from '../../const';
import { appInfo } from '../../model/AppInfo';
import { TrackInfo } from '../../model/TrackInfo';
import { PaintView } from './PaintView';
export class CompView extends PIXI.Container {
    _bg: PIXI.Graphics
    _spArr: Array<PIXI.Sprite>
    _texMap = {}
    _paintCanvas: PaintView
    _spCtn
    constructor(width, height) {
        super()
        this._spArr = []
        this._bg = PIXI_RECT(0, 0, 0, ViewConst.COMP_WIDTH, ViewConst.COMP_HEIGHT)
        this.addChild(this._bg)
        this._spCtn = new PIXI.Container()
        this.addChild(this._spCtn)

        //    let pc = new PaintView()
        //    this._paintCanvas = pc
        //    this.addChild(pc)        

        this.initEvent()
    }

    _newSp() {
        let sp = new PIXI.Sprite()
        this.addChild(sp)
        this._spArr.push(sp)
    }
    pan(x, y) {

    }

    initEvent() {
       appInfo.curComp().on(CompInfoEvent.UPDATE_CURSOR, (frame) => {
            let trackInfoArr =appInfo.curComp().trackInfoArr
            while (this._spArr.length < trackInfoArr.length)
                this._newSp()
            let renderTrack = (i) => {
                var tInfo: TrackInfo = trackInfoArr[i];
                if (tInfo) {
                    var filename = tInfo.getFrameByCursor(frame)
                    if (filename) {
                        this._spArr[i].visible = true && tInfo.enable()
                        console.log('udpate comp view', frame, filename, trackInfoArr.length);
                        if (!this._texMap[filename]) {
                            loadImg(filename, (img) => {
                                imgCache.setImg(filename, img);
                                this._texMap[filename] = imgToTex(img)
                                this._spArr[i].texture = this._texMap[filename]
                                renderTrack(i + 1)
                            })
                        }
                        else {
                            this._spArr[i].texture = this._texMap[filename]
                            renderTrack(i + 1)
                        }
                    }
                    else {
                        this._spArr[i].visible = false
                        renderTrack(i + 1)
                    }
                }
            }
            renderTrack(0)
        })

    }
}