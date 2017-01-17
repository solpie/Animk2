class Clip extends PIXI.Container {
    start = 1
    constructor() {
        super()
        this.addChild(new PIXI.Graphics().beginFill(0xffff00).drawRect(0, 0, 300, 40))
    }
}
export class Stacker extends PIXI.Container {
    nameText: PIXI.Text
    bg
    scrollX = 0
    clip: Clip
    clipCtn:PIXI.Container
    constructor(name: string) {
        super()
        this.bg = new PIXI.Graphics().beginFill(0x343434).drawRect(0, 0, 500, 60)
        this.addChild(this.bg)
        
        let nt = new PIXI.Text(name)
        this.nameText = nt
        this.addChild(this.nameText)

        this.clipCtn = new PIXI.Container()        
        this.clipCtn.x = 230
        this.addChild(this.clipCtn)
        let clip = new Clip()
        this.clip = clip
        this.clipCtn.addChild(clip)
        this.scroll(0)
    }

    scroll(v) {
        console.log('scroll' ,v);
        this.scrollX = v
        this.clip.x = -this.scrollX + this.clip.start * 40
    }
}