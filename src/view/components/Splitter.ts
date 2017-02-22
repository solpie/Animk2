import { IResize } from './IResize';
import { input, InputEvent } from '../../utils/Input';
import { isIn, PIXI_RECT, setupDrag } from '../../utils/PixiEx';
import { TweenEx } from '../../utils/TweenEx';
import { animk } from '../Animk';
import { BaseEvent } from '../const';
export class Splitter extends PIXI.Container {
    bar: PIXI.Sprite
    child1: IResize;
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

        let mid, uid;
        input.on(InputEvent.MOUSE_DOWN, (e) => {
            let isInner = isIn(e, this._barBg)
            isPress = true
            console.log('press Splitter');
            if (isInner) {
                TweenEx.delayedCall(200, () => {
                    if (isPress) {
                        lastMousePosY = e.my
                        lastMousePosX = e.mx
                        this.bar.getChildAt(0).alpha = .6
                    }
                })

                mid = input.on(InputEvent.MOUSE_MOVE, (e) => {
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
                })
                uid = input.on(InputEvent.MOUSE_UP, (e) => {
                    isPress = false
                    lastMousePosX = -1
                    lastMousePosY = -1
                    this.bar.getChildAt(0).alpha = 1

                    input.del(InputEvent.MOUSE_MOVE, mid)
                    input.del(InputEvent.MOUSE_UP, uid)
                })
                return InputEvent.stopPropagation
            }
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
        if (this.child1) {
            this.child1.resize(null, by)
        }
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
    setChild(child: IResize) {
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
    _barBg: any
    resize(width, height) {
        this._w = width
        this._h = height
        if (this.dir == 'v') {
            // this.bar.
            this.setBarY(height / 2)
            if (!this.bar.children.length)
                this._barBg = this.bar.addChild(new PIXI.Graphics()
                    .beginFill(this.colBg)
                    .drawRect(0, 0, width, this.barSpace))
            else
                this._barBg.width = width
            this.mask1.width = width
            this.mask2.width = width
        }
        else if (this.dir == 'h') {
            this._setBarX(width / 2)
            this.mask1.height = height
            this.mask2.height = height
            if (!this.bar.children.length)
                this._barBg = this.bar.addChild(new PIXI.Graphics()
                    .beginFill(this.colBg)
                    .drawRect(0, 0, this.barSpace, height)
                )
            else
                this._barBg.height = height
        }

    }
}