import { input } from '../model/Input';
import { PIXI_RECT, setupDrag } from '../../utils/PixiEx';
import { TweenEx } from '../../utils/TweenEx';
import { animk } from '../Animk';
import { BaseEvent, InputEvent } from '../const';
export class Splitter extends PIXI.Container {
    bar: PIXI.Sprite
    child1: any;
    child2: any;
    dir
    child1Space
    child2Space
    barSpace = 40

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
        // this.bar.alpha = .9

        var lastMousePosX = -1,
            lastMousePosY = -1
            , isPress
        setupDrag(this.bar, (e) => {
            isPress = true
            TweenEx.delayedCall(200, () => {
                console.log('mouse');
                if (isPress) {
                    lastMousePosY = e.my
                    lastMousePosX = e.mx
                    this.bar.getChildAt(0).alpha = .6
                }
            })
        }, (e) => {
            if (this.dir == 'v') {
                if (lastMousePosY > -1) {
                    // this.bar.y += e.data.originalEvent.clientY - this.lastMousePosY
                    this.setBarY(this.bar.y + e.my - lastMousePosY)
                    lastMousePosY = e.my
                    if (this.child2) {
                        this.emit(BaseEvent.CHANGED, this)
                    }
                }
            }
            else if (this.dir == 'h') {
                if (lastMousePosX > -1) {
                    this.bar.x += e.my - lastMousePosX
                    lastMousePosX = e.mx
                }
            }
        }, (e) => {
            onUp(e)
        })
        let onUp = (e) => {
            isPress = false
            lastMousePosX = -1
            lastMousePosY = -1
            this.bar.getChildAt(0).alpha = 1
        }

        input.on(InputEvent.MOUSE_UP, (e) => {
            onUp(e)
        })

        this.addChild(this.bar)
        this.mask1 = new PIXI.Graphics().drawRect(0, 0, 1100, 1000)
        // this.mask1.interactive = true
        this.mask2 = PIXI_RECT(0x1c1c1c, 0, 0, 1000, 1000)

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
    colBg = 0x232323
    resize(width, height) {
        if (this.dir == 'v') {
            // this.bar.
            this.setBarY(height / 2)
            if (!this.bar.children.length)
                this.bar.addChild(new PIXI.Graphics()
                    .beginFill(this.colBg)
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
                    .beginFill(this.colBg)
                    .drawRect(0, 0, this.barSpace, height)
                )
        }

    }
}