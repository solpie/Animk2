import { appInfo } from './model/AppInfo';
require(`script!./../libs/pixi.min.js`);
require(`script!./../libs/Tween.min.js`);
import { ViewConst } from './const';
import { animk } from './Animk';
// console.log('running!')
declare const TWEEN
let main = () => {
    let renderer: any = PIXI.autoDetectRenderer(ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT,
        { antialias: false, transparent: true, resolution: 1 });
    document.body.insertBefore(renderer.view, document.getElementById("app"));
    renderer.stage = new PIXI.Container();
    renderer.backgroundColor = 0x00000000;
    //Loop this function 60 times per second
    renderer.renderStage = (time) => {
        requestAnimationFrame(renderer.renderStage);
        TWEEN.update(time)
        renderer.render(renderer.stage);
    };
    renderer.renderStage();
    return renderer.stage;
}

animk.init(main(),appInfo)
