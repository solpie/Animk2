import { CheckBox } from '../components/CheckBox';
import { newBitmap, PIXI_RECT } from '../../utils/PixiEx';
import { Col } from '../model/Color';
import { animk } from './../Animk';
import { BaseEvent, TrackInfoEvent } from './../const';
import { FrameInfo } from './../model/FrameInfo';
import { TrackInfo } from './../model/TrackInfo';
import { Clip } from './Clip';
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

        let clip = new Clip(trackInfo)
        this.clip = clip
        this.clipCtn.addChild(clip)

        //left panel        
        this.addChild(PIXI_RECT(0x343434, 0, 0, 200, 60))

        let nts = { fill: Col.trackText, fontSize: '15px' }
        let nt = new PIXI.Text(trackInfo.name(), nts)
        nt.y = 5
        nt.x = 10
        this.nameText = nt
        this.addChild(this.nameText)

        let cb = new CheckBox(animk)
        cb.x = 150
        cb.y = 5
        cb.on(BaseEvent.CHANGED, (v) => {
            this.trackInfo.enable(v)
        })
        this.addChild(cb)

        this.initEvent()
        this.scroll(0)
    }
    initEvent() {
        this.trackInfo.on(TrackInfoEvent.PUSH_FRAME, (frameInfo: FrameInfo) => {
            let fw = animk.projInfo.curComp.frameWidth
            let s = newBitmap({ url: frameInfo.filename, x: (frameInfo.idx() - 1) * fw, y: 16 })
            s.width = fw - 1
            s.height = fw - 1
            let bg = PIXI_RECT(0xffffff, 0, 0, s.width, s.height)
            bg.x = s.x
            bg.y = s.y
            this.clip.addChild(bg)
            this.clip.addChild(s)
            this.clip.resize()
        })
    }

    scroll(v) {
        console.log('scroll', v);
        this.scrollX = v
        let fw = animk.projInfo.curComp.frameWidth
        this.clip.x = -this.scrollX + (this.trackInfo.start()) * fw
    }
}