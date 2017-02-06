import { input , InputEvent} from '../../utils/Input';
import { PIXI_MakeMatrixGraphics, PIXI_MOUSE_EVENT } from '../../utils/PixiEx';
import { animk } from '../Animk';
import { Button } from '../components/Button';
import { CompInfoEvent } from '../const';
import { Col } from '../model/Color';

export class TimestampBar extends PIXI.Sprite {
    gTick: PIXI.Graphics
    gMask: PIXI.Graphics
    gCursor: PIXI.Graphics
    textCtn: PIXI.Container
    gBg: PIXI.Graphics
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

        let m2 = [
            '7.........7',
            '...........',
            '...........',
            '...........',
            '...........',
            '...........',
            '9...   ...9',
            '5.... ....5',
            ' 4... ...4 ',
            ' 18.. ..81 ',
            '  3.. ..3  ',
            '   6. .6   ',
            '   19 91   ',
        ]
       
        this.gCursor = new PIXI.Graphics()
        PIXI_MakeMatrixGraphics(m2, Col.cursor, this.gCursor, -6, 0)

        this.gCursor
            .lineStyle(1, Col.cursor)
            .moveTo(0, 15)
            .lineTo(0, 500)
        this.gCursor.cacheAsBitmap = true
        this.gCursor.y = 25
        this.addChild(this.gCursor)

        ///


        input.on(InputEvent.MOUSE_UP, (e) => {
            let a = e.mx - this.x - this.gTick.x
            let thisPos = this.toGlobal(new PIXI.Point(this.x, this.y))
            let fw = animk.projInfo.frameWidth()
            if (e.my > thisPos.y && e.my < thisPos.y + this.height) {
                if (a > 0) {
                    animk.projInfo.curComp.setCursor(Math.floor((a) / fw))
                }
            }
        })

        this.gBg = new PIXI.Graphics()
            .beginFill(Col.panelBg)
            .drawRect(0, 0, 215, 40)
        this.gBg.x = -215
        this.addChild(this.gBg)

        let newTrackBtn = new Button({ text: "new" })
        newTrackBtn.x = -100
        newTrackBtn.on(PIXI_MOUSE_EVENT.down, () => {
            const {dialog} = require('electron').remote
            let ret = dialog.showOpenDialog({
                properties: ['openFile'], filters: [
                    { name: 'Images(png)', extensions: ['png'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            })
            if (ret && ret.length == 1)
                animk.projInfo.curComp.newTrack(ret[0])
        })
        this.addChild(newTrackBtn)
        this.initEvent()
        this.resize(1600, this.height)

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
        this.gTick.lineStyle(1, Col.tick)
        let ts = { fill: Col.tickText, fontSize: '12px' }
        let fw = animk.projInfo.frameWidth()
        var frame = 0
        for (var i = 0; i < width; i += fw) {
            this.gTick.moveTo(i, 35)
            this.gTick.lineTo(i, fw)
            var textTick = new PIXI.Text(frame + '', ts)
            textTick.x = i - textTick.width * .5
            textTick.y = 13
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