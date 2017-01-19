import { cmd } from '../model/Command';
import { CompInfoEvent, InputEvent } from '../const';
import { animk } from '../Animk';
import { PIXI_MOUSE_EVENT } from '../../utils/PixiEx';
import { Button } from '../components/Button';

export class TimestampBar extends PIXI.Sprite {
    gTick: PIXI.Graphics
    colTick = 0x000000
    gMask: PIXI.Graphics
    gCursor: PIXI.Graphics
    textCtn: PIXI.Container
    cursorPos = 0
    constructor() {
        super()
        this.textCtn = new PIXI.Container()
        this.addChild(this.textCtn)

        this.gTick = new PIXI.Graphics()
        this.addChild(this.gTick)

        this.gMask = new PIXI.Graphics().drawRect(0, 0, 1600, this.height)
        this.addChild(this.gMask)
        this.gTick.mask = this.gMask

        this.gCursor = new PIXI.Graphics()
            .lineStyle(2, 0xff0000)
            .moveTo(0, 55)
            .lineTo(0, 500)
        this.addChild(this.gCursor)

        this.resize(1600, this.height)

        animk.on(InputEvent.MOUSE_UP, (e) => {
            let a = e.mx - this.x - this.gTick.x
            let thisPos = this.toGlobal(new PIXI.Point(this.x, this.y))
            let fw = animk.projInfo.frameWidth()
            if (e.my > thisPos.y && e.my < thisPos.y + this.height) {
                if (a > 0) {
                    animk.projInfo.curComp.setCursor(Math.floor((a) / fw))
                    // this.cursorPos = Math.floor((a) / fw) * fw
                    // this.gCursor.x = this.gTick.x + this.cursorPos
                }
            }
        })



        let newTrackBtn = new Button({ text: "new" })
        newTrackBtn.x = -100
        newTrackBtn.on(PIXI_MOUSE_EVENT.up, () => {
            const {dialog} = require('electron').remote
            let ret = dialog.showOpenDialog({
                properties: ['openFile'], filters: [
                    { name: 'Images(png)', extensions: ['png'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            })
            if (ret.length == 1)
                animk.projInfo.curComp.newTrack(ret[0])
            // cmd.emit(CommandId.NewTrack, ret)
        })
        this.addChild(newTrackBtn)
        this.initEvent()
    }
    initEvent() {
        animk.projInfo.curComp.on(CompInfoEvent.UPDATE_CURSOR, (frame) => {
            let fw = animk.projInfo.frameWidth()
            this.cursorPos = frame * fw
            this.gCursor.x = this.gTick.x + this.cursorPos
        })
    }
    resize(width, height) {
        // console.log('resize timestampBar', width);
        this.textCtn.removeChildren()

        this.gMask.clear()
        this.gMask.drawRect(0, 0, width, height)

        this.gTick.clear()
        this.gTick.lineStyle(1, this.colTick)
        let ts = { fill: 0xffffff, fontSize: '12px' }
        let fw = animk.projInfo.frameWidth()
        var frame = 0
        for (var i = 0; i < width; i += fw) {
            this.gTick.moveTo(i, 20)
            this.gTick.lineTo(i, fw)
            var textTick = new PIXI.Text(frame + '', ts)
            textTick.x = i + 3
            textTick.y = 23
            this.textCtn.addChild(textTick)
            frame++
        }

    }

    scroll(v) {
        this.gTick.x = -v
        this.gCursor.x = this.gTick.x + this.cursorPos
        this.textCtn.x = -v
    }

    get height() {
        return 40
    }
}