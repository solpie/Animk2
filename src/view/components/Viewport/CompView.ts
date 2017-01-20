import { loadImg } from '../../../utils/JsFunc';
import { TrackInfo } from '../../model/TrackInfo';
import { animk } from '../../Animk';
import { CompInfoEvent, ViewConst } from '../../const';
import { imgToTex, loadRes, PIXI_RECT } from '../../../utils/PixiEx';
export class CompView extends PIXI.Container {
    _bg: PIXI.Graphics
    _spArr: Array<PIXI.Sprite>
    _imgMap = {}
    constructor(width, height) {
        super()
        this._spArr = []

        this._bg = PIXI_RECT(0, 0, 0, ViewConst.COMP_WIDTH, ViewConst.COMP_HEIGHT)
        this.addChild(this._bg)

        this.initEvent()
    }
    
    _newSp() {
        let sp = new PIXI.Sprite()
        this.addChild(sp)
        this._spArr.push(sp)
    }

    initEvent() {
        animk.projInfo.curComp.on(CompInfoEvent.UPDATE_CURSOR, (frame) => {
            let trackInfoArr = animk.projInfo.curComp.trackInfoArr

            while (this._spArr.length < trackInfoArr.length)
                this._newSp()
            let renderTrack = (i) => {
                var tInfo: TrackInfo = trackInfoArr[i];
                if (tInfo) {
                    var filename = tInfo.getFrameByCursor(frame)
                    console.log('udpate comp view', frame, filename, trackInfoArr.length);
                    if (!this._imgMap[filename]) {
                        loadImg(filename, (img) => {
                            this._imgMap[filename] = imgToTex(img)
                            this._spArr[i].texture = this._imgMap[filename]
                            renderTrack(i + 1)
                        })
                    }
                    else {
                        this._spArr[i].texture = this._imgMap[filename]
                        renderTrack(i + 1)
                    }
                }
            }
            renderTrack(0)
        })
    }
}