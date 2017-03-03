import { colorToHex } from '../../utils/anmkp/AnpUtil';
import { ColorPicker } from '../components/Viewport/ColorPicker';
import { Col } from '../model/Color';
import { input, InputEvent } from '../../utils/Input';
import { TrackInfo } from '../model/TrackInfo';
import { PIXI_RECT, setupDrag } from '../../utils/PixiEx';
import { animk } from '../Animk';
import { COLOR, TrackInfoEvent } from '../const';
export class Clip extends PIXI.Container {
    header: PIXI.Graphics
    bg: PIXI.Graphics
    trackInfo: TrackInfo
    _frameSp: Array<PIXI.Sprite>
    _textCtn: PIXI.Container

    constructor(trackInfo: TrackInfo) {
        super()
        this._frameSp = []
        this.trackInfo = trackInfo

        this.bg = PIXI_RECT(0, 0, 0, 1, 55)
        this.addChild(this.bg)
        this.header = new PIXI.Graphics()
            .beginFill(0x2f2f2f).drawRect(0, 0, 1, 15)
            .beginFill(0x343434).drawRect(0, 0, 1, 1)
            .beginFill(0x383838).drawRect(0, 0, 1, 2)
        this.addChild(this.header)
        this.header.interactive = true
        this.header.buttonMode = true

        var lastX = null, dtX, flag = 1
        setupDrag(this.header, (e) => {
            lastX = e.mx
        }, (e) => {
            if (lastX != null) {
                dtX = e.mx - lastX
                dtX > 0 ? flag = 1 : flag = -1;
                dtX = Math.abs(dtX)
                let fw = animk.projInfo.frameWidth()
                var cx
                if (dtX > fw) {
                    trackInfo.start(trackInfo.start() + flag * Math.floor(dtX / fw))
                    lastX = e.mx
                    // this.x += cx
                    // lastX = null
                }
            }
        }, () => {
            lastX = null
        })
        input.on(InputEvent.MOUSE_UP, () => {
            lastX = null
        })

        trackInfo.on(TrackInfoEvent.SET_TRACK_START, (t:TrackInfo) => {
            let fw = animk.projInfo.frameWidth()
            this.x = t.start() * fw
        })
        this._textCtn = new PIXI.Container()
        this.addChild(this._textCtn)
    }

    addFrame(sp) {
        this._frameSp.push(sp)
        this.addChild(sp)
    }

    update() {
        if (this.trackInfo) {
            this._textCtn.cacheAsBitmap = false
            this._textCtn.removeChildren()

            let s = { fontSize: '10px', fill: colorToHex(Col.panelText) }
            let fw = animk.projInfo.frameWidth()
            let lastPos = 0
            for (let frameInfo of this.trackInfo.frameInfoArr) {
                let f = new PIXI.Text(frameInfo.idx() + '', s)
                this._frameSp[frameInfo.idx() - 1].x = lastPos * fw
                f.x = lastPos * fw + 1
                f.y = 2
                lastPos = frameInfo.getStart() - 1 + frameInfo.getHold()
                this._textCtn.addChild(f)
            }

            this._textCtn.cacheAsBitmap = true
        }
        // g.cacheAsBitmap = true
    }
    resize() {
        let fw = animk.projInfo.frameWidth()

        this.bg.width = this.trackInfo.lengthFrame * fw
        this.header.width = this.bg.width

    }
}