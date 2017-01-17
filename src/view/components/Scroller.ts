import { ScrollEvent, ViewConst } from '../const';
import { EventDispatcher } from '../../utils/EventDispatcher';
import { setupDrag } from '../../utils/PixiEx';
export class Scroller extends PIXI.Container {
    bg
    thumb
    static ScrollerHeight = 15

    dir
    max
    lastMousePosX = -1
    lastMousePosY = -1
    evt: EventDispatcher

    maxValue
    minValue
    constructor(dir, max, minValue, maxValue) {
        super()
        this.dir = dir
        this.max = max
        this.minValue = minValue
        this.maxValue = maxValue
        this.evt = new EventDispatcher()

        var w, h;
        var tw, th;
        if (dir == 'v') {
            h = max
            w = Scroller.ScrollerHeight
            th = 100
            tw = Scroller.ScrollerHeight - 2
        }
        else if (dir == 'h') {
            w = max
            h = Scroller.ScrollerHeight
            tw = 100
            th = Scroller.ScrollerHeight - 2
        }
        this.bg = new PIXI.Graphics().beginFill(0x2e2e2e).drawRect(0, 0, w, h)
        this.addChild(this.bg)
        this.thumb = new PIXI.Graphics().beginFill(0x505050).drawRect(0, 0, tw, th)
        this.addChild(this.thumb)


        setupDrag(this.thumb, (e) => {
            this.lastMousePosY = e.data.originalEvent.clientY
            this.lastMousePosX = e.data.originalEvent.clientX
            this.thumb.alpha = .8
        }, (e) => {
            if (this.dir == 'v') {
                if (this.lastMousePosY > -1) {
                    this.thumb.y += e.data.originalEvent.clientY - this.lastMousePosY
                    if (this.thumb.y < 0)
                        this.thumb.y = 0
                    else if (this.thumb.y + this.thumb.height > this.max)
                        this.thumb.y = this.max - this.thumb.height
                    else {
                        this.lastMousePosY = e.data.originalEvent.clientY
                        // remote.getCurrentWebContents().sendInputEvent({type: 'mouseMove', x: 10, y: 10})
                        this.evt.emit(ScrollEvent.CHANGED, this.value)
                    }

                    // if (this.child2) {
                    //     this.child2.y = this.bar.y + this.bar.height
                    // }
                }
            }
            else if (this.dir == 'h') {
                if (this.lastMousePosX > -1) {
                    this.thumb.x += e.data.originalEvent.clientY - this.lastMousePosX
                    if (this.thumb.x < 0)
                        this.thumb.x = 0
                    else if (this.thumb.x + this.thumb.width > this.max)
                        this.thumb.x = this.max - this.thumb.width
                    else {
                        this.lastMousePosX = e.data.originalEvent.clientX
                        this.evt.emit(ScrollEvent.CHANGED, this.value)
                    }
                }
            }
        }, (e) => {
            this.lastMousePosX = -1
            this.lastMousePosY = -1
            this.thumb.alpha = 1
        })
    }
    get value() {
        if (this.dir == 'v')
            return this.thumb.y / (this.max - this.thumb.height) * (this.maxValue - this.minValue)
        if (this.dir == 'h')
            return this.thumb.x / (this.max - this.thumb.width) * (this.maxValue - this.minValue)
    }

    setMax(v) {
        this.max = v
        if (this.dir == 'v') {
            this.bg.height = v
        }
        else if (this.dir == 'h') {
            this.bg.width = v
        }
    }

    setThumb(v) {
        if (this.dir == 'v') {
            this.thumb.height = v
        }
        else if (this.dir == 'h') {
            this.thumb.width = v
        }
    }

    setRange(minValue, maxValue) {
        this.minValue = minValue
        this.maxValue = maxValue
    }
}