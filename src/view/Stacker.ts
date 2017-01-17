export class Stacker extends PIXI.Container {
    nameText: PIXI.Text
    bg
    constructor(name:string) {
        super()
        this.bg = new PIXI.Graphics().beginFill(0x343434).drawRect(0, 0, 500, 60)
        this.addChild(this.bg)

        let nt = new PIXI.Text(name)
        this.nameText = nt
        this.addChild(this.nameText)
    }
}