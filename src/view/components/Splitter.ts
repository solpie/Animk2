import { dirname } from 'path';
export class Splitter extends PIXI.Container {
    bar: PIXI.Sprite
    child1: any;
    child2: any;
    dir
    child1Space
    barSpace = 8
    constructor(dir, width, height) {
        super()
        this.dir = dir
        this.bar = new PIXI.Sprite()
        this.addChild(this.bar)
        if (dir == 'v') {
            // this.bar.
            this.child1Space = height / 2
            this.bar.y = this.child1Space
            this.bar.addChild(new PIXI.Graphics()
                .beginFill(0x2e2e2e)
                .drawRect(0, 0, width, this.barSpace))
        }
        else if (dir == 'h') {
            this.child1Space = width / 2
            this.bar.x = this.child1Space
            this.bar.addChild(new PIXI.Graphics()
                .beginFill(0x2e2e2e)
                .drawRect(0, 0, this.barSpace, height))
        }
    }

    setChild(child: PIXI.DisplayObject) {
        this.addChild(child)
        if (!this.child1) {
            this.child1 = child
        }
        else if (!this.child2) {
            this.child2 = child
            if (this.dir == 'v') {
                child.y = this.child1Space + this.barSpace
            }
            else if (this.dir == 'h') {
                child.x = this.child1Space + this.barSpace
            }
        }


    }
}