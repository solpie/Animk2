require(`script!./../libs/pixi.min.js`);
require(`script!./../libs/Tween.min.js`);
import { animk } from './Animk';
import { ViewConst } from './const';
import { appInfo } from './model/AppInfo';
import { imgCache } from './model/ImageCache';
import { initTest } from './Test';
// console.log('running!')
declare const TWEEN
let renderer: any
let main = () => {
    renderer = PIXI.autoDetectRenderer(ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT,
        { antialias: true, transparent: false, resolution:1 });
    document.body.appendChild(renderer.view);
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
const {remote} = require('electron')
window['remote'] = remote

window.addEventListener('resize', function (e) {
    e.preventDefault();

    let win = remote.getCurrentWindow();
    let size = win.getSize()
    renderer.resize(size[0], size[1])
    animk.resize(size[0], size[1])
})
