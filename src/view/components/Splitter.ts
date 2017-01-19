import { TimestampBar } from '../LayerTracker';
import { animk } from '../Animk';
import { ScrollEvent, ViewEvent } from '../const';
import { EventDispatcher } from '../../utils/EventDispatcher';
import { PIXI_MOUSE_EVENT, setupDrag } from '../../utils/PixiEx';
// import { dirname } from 'path';
export class Splitter extends PIXI.Container {
    bar: PIXI.Sprite
    child1: any;
    child2: any;
    dir
    child1Space
    child2Space
    barSpace = 40
    lastMousePosX = -1
    lastMousePosY = -1
    evt: EventDispatcher = new EventDispatcher
    mask1: PIXI.Graphics
    mask2: PIXI.Graphics
    _w
    _h
    get width() { return this._w }
    get height() { return this._h }
    constructor(dir, width, height) {
        super()
        this._w = width
        this._h = height

        this.dir = dir
        this.bar = new PIXI.Sprite()
        this.bar.alpha = .9
        setupDrag(this.bar, (e) => {
            this.lastMousePosY = e.data.originalEvent.clientY
            this.lastMousePosX = e.data.originalEvent.clientX
            this.bar.alpha = .6
        }, (e) => {
            if (this.dir == 'v') {
                if (this.lastMousePosY > -1) {
                    // this.bar.y += e.data.originalEvent.clientY - this.lastMousePosY
                    this.setBarY(this.bar.y + e.my - this.lastMousePosY)
                    this.lastMousePosY = e.data.originalEvent.clientY
                    if (this.child2) {
                        this.evt.emit(ScrollEvent.CHANGED, this)
                    }
                }
            }
            else if (this.dir == 'h') {
                if (this.lastMousePosX > -1) {
                    this.bar.x += e.data.originalEvent.clientY - this.lastMousePosX
                    this.lastMousePosX = e.data.originalEvent.clientX
                }
            }
        }, (e) => {
            this.lastMousePosX = -1
            this.lastMousePosY = -1
            this.bar.alpha = .9
        })

        animk.on(ViewEvent.MOUSE_UP, () => {
            this.lastMousePosX = -1
            this.lastMousePosY = -1
            this.bar.alpha = .9
        })

        
        this.addChild(this.bar)
        this.mask1 = new PIXI.Graphics().drawRect(0, 0, 1100, 1000)
        // this.mask1.interactive = true
        this.mask2 = new PIXI.Graphics().drawRect(0, 0, 1000, 1000)

        // this.mask2.interactive = true
        // this.addChild(this.mask1)
        this.addChild(this.mask2)
        this.resize(width, height)
    }
    setBarY(by) {
        this.bar.y = by
        this.child1Space = by
        this.child2Space = this.height - by - this.barSpace
        this.mask1.height = by
        if (this.child2) {
            this.child2.y = by + this.barSpace
        }
        this.mask2.y = this.bar.y + this.barSpace
        this.mask2.height = this.child2Space
    }
    _setBarX(bx) {
        this.bar.x = bx
        this.child1Space = bx
        this.child2Space = this.width - bx - this.barSpace
    }
    setChild(child: PIXI.DisplayObject) {
        // child.interactiveChildren = true
        // child.interactive = true
        // child.buttonMode = true
        if (!this.child1) {
            this.child1 = child
            this.addChildAt(child, 0)
            // child.mask = this.mask1
        }
        else if (!this.child2) {
            this.child2 = child
            this.addChild(child)

            // child.mask = this.mask2
            if (this.dir == 'v') {
                child.y = this.child1Space + this.barSpace
            }
            else if (this.dir == 'h') {
                child.x = this.child1Space + this.barSpace
            }
        }
        this.addChild(this.bar)
    }

    resize(width, height) {
        if (this.dir == 'v') {
            // this.bar.
            this.setBarY(height / 2)
            if (!this.bar.children.length)
                this.bar.addChild(new PIXI.Graphics()
                    .beginFill(0x2e2e2e)
                    .drawRect(0, 0, width, this.barSpace))
            this.mask1.width = width
            this.mask2.width = width
        }
        else if (this.dir == 'h') {
            this._setBarX(width / 2)
            this.mask1.height = height
            this.mask2.height = height
            if (!this.bar.children.length)
                this.bar.addChild(new PIXI.Graphics()
                    .beginFill(0x2e2e2e)
                    .drawRect(0, 0, this.barSpace, height))
        }
    
    }
}