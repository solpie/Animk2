import { animk } from './Animk';
import { FrameInfo } from './model/FrameInfo';
import { TrackInfoEvent } from './const';
import { TrackInfo } from './model/TrackInfo';
import { newBitmap, PIXI_RECT } from '../utils/PixiEx';
class Clip extends PIXI.Container {
    start = 1
    constructor() {
        super()
        this.addChild(new PIXI.Graphics().beginFill(0xffff00).drawRect(0, 0, 300, 15))
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