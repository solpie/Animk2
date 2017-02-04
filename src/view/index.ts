require(`script!./../libs/pixi.min.js`);
require(`script!./../libs/Tween.min.js`);
import { imgCache } from './model/ImageCache';
import { appInfo } from './model/AppInfo';
import { initTest } from './Test';
import { ViewConst } from './const';
import { animk } from './Animk';
// console.log('running!')
declare const TWEEN
let renderer: any
let main = () => {
    renderer = PIXI.autoDetectRenderer(ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT,
        { antialias: false, transparent: true, resolution: 1 });
    document.body.insertBefore(renderer.view, document.getElementById("paintCanvas"));
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


initTest()
imgCache
animk.init(main(), appInfo)
window['animk'] = animk

window.addEventListener('resize', function (e) {
    e.preventDefault();
    const {remote} = require('electron')
    let win = remote.getCurrentWindow();
    let size = win.getSize()
    renderer.resize(size[0], size[1])
    animk.resize(size[0],size[1])
})
