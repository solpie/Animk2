import { TrackInfo } from '../model/TrackInfo';
import { PIXI_RECT, setupDrag } from '../../utils/PixiEx';
import { animk } from '../Animk';
import { InputEvent, TrackInfoEvent } from '../const';
export class Clip extends PIXI.Container {
    header: PIXI.Graphics
    bg: PIXI.Graphics
    trackInfo: TrackInfo
    constructor(trackInfo: TrackInfo) {
        super()
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
        animk.on(InputEvent.MOUSE_UP, () => {
            lastX = null
        })

        trackInfo.on(TrackInfoEvent.SET_TRACK_START, (start) => {
            let fw = animk.projInfo.frameWidth()
            this.x = start * fw
        })
    }

    resize() {
        this.bg.width = this.width
        this.header.width = this.width
    }
}