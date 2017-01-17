require(`script!./../libs/pixi.min.js`);
import { Animk } from './Animk';
import { ViewConst } from './const';
console.log('running!')
let main = () => {
    let renderer: any = PIXI.autoDetectRenderer(ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT,
        { antialias: false, transparent: true, resolution: 1 });
    document.body.insertBefore(renderer.view, document.getElementById("app"));
    renderer.stage = new PIXI.Container();
    renderer.backgroundColor = 0x00000000;
    //Loop this function 60 times per second
    renderer.renderStage = (time) => {
        requestAnimationFrame(renderer.renderStage);
        // TWEEN.update(time)
        renderer.render(renderer.stage);
    };
    renderer.renderStage();
    return renderer.stage;
}
new Animk(main())
