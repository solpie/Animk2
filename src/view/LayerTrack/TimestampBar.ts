import { Col } from '../model/Color';
import { cmd } from '../model/Command';
import { CompInfoEvent, InputEvent } from '../const';
import { animk } from '../Animk';
import { FillMatrix, MakeMatrix, PIXI_MOUSE_EVENT } from '../../utils/PixiEx';
import { Button } from '../components/Button';

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

        let m = MakeMatrix(13,11,Col.cursor)
        let m1 = [
            [.7, 1, 1, 1, 1, 1, 1, 1, 1, 1, .7],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [.9, 1, 1, 1, 0, 0, 0, 1, 1, 1, .9],
            [.5, 1, 1, 1, 1, 0, 1, 1, 1, 1, .5],
            [0, .4, 1, 1, 1, 0, 1, 1, 1, .4, 0],
            [0, .1, .8, 1, 1, 0, 1, 1, .8, .1, 0],
            [0, 0, .3, 1, 1, 0, 1, 1, .3, 0, 0],
            [0, 0, 0, .6, 1, 0, 1, .6, 0, 0, 0],
            [0, 0, 0, .1, .9, 0, .9, .1, 0, 0, 0],
        ]

        for (var y = 0; y < m1.length; y++) {
            var rowArr = m1[y];
            for (var x = 0; x < rowArr.length; x++) {
                var alpha = rowArr[x];
                m[y][x].alpha = alpha
            }
        }
        this.gCursor = new PIXI.Graphics()
        FillMatrix(this.gCursor, m, -6, 0)
        this.gCursor
            .lineStyle(1, Col.cursor)
            .moveTo(0, 15)
            .lineTo(0, 500)
        this.gCursor.cacheAsBitmap = true
        this.gCursor.y = 25
        this.addChild(this.gCursor)

        ///


        animk.on(InputEvent.MOUSE_UP, (e) => {
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
        newTrackBtn.on(PIXI_MOUSE_EVENT.up, () => {
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