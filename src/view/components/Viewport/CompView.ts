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
        let sp = new PIXI.Sprite()
        this._spArr = [sp]

        this._bg = PIXI_RECT(0, 0, 0, ViewConst.COMP_WIDTH, ViewConst.COMP_HEIGHT)
        this.addChild(this._bg)
        this.addChild(sp)

        this.initEvent()
    }
    initEvent() {
        animk.projInfo.curComp.on(CompInfoEvent.UPDATE_CURSOR, (frame) => {
            let trackInfoArr = animk.projInfo.curComp.trackInfoArr
            for (var i = 0; i < trackInfoArr.length; i++) {
                var tInfo: TrackInfo = trackInfoArr[i];
                var filename = tInfo.getFrameByCursor(frame)
                console.log('udpate comp view', frame, filename);

                if (!this._imgMap[filename]) {
                    loadImg(filename, (img) => {
                        this._imgMap[filename] = imgToTex(img)
                        this._spArr[0].texture = this._imgMap[filename]
                    })
                }
                else
                    this._spArr[0].texture = this._imgMap[filename]
            }
        })
    }
}