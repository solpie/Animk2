import { Splitter } from './components/Splitter';
export class Animk {
    vSplitter: Splitter
    constructor(stage: PIXI.Container) {
        let vs = new Splitter('v', 1600, 800)
        this.vSplitter = vs
        stage.addChild(vs)

        let c1 = new PIXI.Graphics().beginFill(0xff0000).drawRect(0,0,400,200)
        vs.setChild(c1)

        let c2 = new PIXI.Graphics().beginFill(0xffff00).drawRect(0,0,400,200)
        vs.setChild(c2)
    }
}