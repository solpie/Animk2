import { animk } from './Animk';
import { FrameInfo } from './model/FrameInfo';
import { TrackInfoEvent, ViewEvent } from './const';
import { TrackInfo } from './model/TrackInfo';
import { newBitmap, PIXI_RECT, setupDrag } from '../utils/PixiEx';
class Clip extends PIXI.Container {
    start = 1
    header: PIXI.Graphics
    constructor() {
        super()
        this.header = new PIXI.Graphics()
            .beginFill(0x2f2f2f).drawRect(0, 0, 1, 15)
            .beginFill(0x343434).drawRect(0, 0, 1, 1)
            .beginFill(0x383838).drawRect(0, 0, 1, 2)
        this.addChild(this.header)
        this.header.interactive = true
        this.header.buttonMode = true

        var lastX, dtX
        setupDrag(this.header, (e) => {
            lastX = e.mx
        }, (e) => {
            if (lastX != null) {
                dtX = e.mx - lastX
                let fw = animk.projInfo.frameWidth()
                var cx
                if (dtX > fw || dtX < -fw) {
                    cx = Math.floor(dtX / fw) * fw
                    lastX = e.mx
                    this.x += cx
                }
            }
        }, () => {
            lastX = null
        })
        animk.on(ViewEvent.MOUSE_UP, () => {
            lastX = null
        })
    }
    resize() {
        this.header.width = this.width
    }
}
export class Stacker extends PIXI.Container {
    nameText: PIXI.Text
    bg
    scrollX = 0
    clip: Clip
    clipCtn: PIXI.Container
    clipStart = 1
    trackInfo: TrackInfo

    constructor(trackInfo: TrackInfo) {
        super()
        this.trackInfo = trackInfo

        this.bg = new PIXI.Graphics().beginFill(0x343434).drawRect(0, 0, 500, 60)
        this.addChild(this.bg)


        this.clipCtn = new PIXI.Container()
        this.clipCtn.x = 215
        this.addChild(this.clipCtn)
        let clip = new Clip()
        this.clip = clip
        this.clipCtn.addChild(clip)

        this.addChild(PIXI_RECT(0x343434, 0, 0, 200, 60))

        let nt = new PIXI.Text(trackInfo.name())
        this.nameText = nt
        this.addChild(this.nameText)

        this.scroll(0)

        this.initEvent()
    }
    initEvent() {
        this.trackInfo.on(TrackInfoEvent.PUSH_FRAME, (frameInfo: FrameInfo) => {
            let fw = animk.projInfo.curComp.frameWidth
            let s = newBitmap({ url: frameInfo.filename, x: (frameInfo.idx() - 1) * fw, y: 16 })
            s.width = fw
            s.height = fw
            this.clip.addChild(s)
            this.clip.resize()

        })
    }

    load(filePath) {
        console.log('load img', filePath);
    }

    scroll(v) {
        console.log('scroll', v);
        this.scrollX = v
        let fw = animk.projInfo.curComp.frameWidth
        this.clip.x = -this.scrollX + (this.clip.start) * fw
    }
}