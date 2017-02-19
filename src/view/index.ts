require(`script-loader!./../libs/pixi.min.js`);
require(`script-loader!./../libs/Tween.min.js`);
import { animk } from './Animk';
import { ViewConst } from './const';
import { appInfo } from './model/AppInfo';
import { imgCache } from './model/ImageCache';
import { initTest } from './Test';
// console.log('running!')
declare const TWEEN
let renderer: any
let compRender: any
let main = () => {
    compRender = PIXI.autoDetectRenderer(ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT,
        { antialias: true, transparent: true, resolution: 1});
    compRender.stage = new PIXI.Container();

    renderer = PIXI.autoDetectRenderer(ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT,
        { antialias: true, transparent: true, resolution: 1 });

    renderer.backgroundColor = 0x00000000;
    renderer.stage = new PIXI.Container();

    document.body.appendChild(renderer.view);
    document.body.appendChild(compRender.view);
    compRender.view.style.position = 'fixed'
    compRender.view.style.top = '0'
    compRender.view.style.left = '0'
    compRender.view.style.margin = '0'
    compRender.view.style['z-index'] = '0'
    renderer.view.style.position = 'fixed'
    renderer.view.style.top = '0'
    renderer.view.style.left = '0'
    renderer.view.style.margin = '0'
    renderer.view.style['z-index'] = '1'

    //Loop this function 60 times per second
    renderer.renderStage = (time) => {
        requestAnimationFrame(renderer.renderStage);
        TWEEN.update(time)
        compRender.render(compRender.stage)
        renderer.render(renderer.stage);
    };
    renderer.renderStage();

    return { compRender: compRender.stage, uiRender: renderer.stage };
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
