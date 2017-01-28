import { isIn } from '../../../utils/PixiEx';
import { input, InputEvent } from '../../../utils/Input';
export const PaintEvent = {
    undo: 'undo',
    redo: 'redo'
}
export class PaintCanvas {

    //存储当前表面状态数组-上一步
    preDrawAry = []
    //存储当前表面状态数组-下一步
    nextDrawAry = []
    //中间数组
    middleAry = []
    //配置参数
    confing = {
        lineWidth: 6,
        lineColor: "red",
        shadowBlur: 0
    }
    canvas: any
    context: any
    _x: number = 0
    _y: number = 0
    get width() {
        return this.canvas.width
    }
    get height() {
        return this.canvas.height
    }
    constructor() {
        this.canvas = document.getElementById('paintCanvas')
        this.canvas.style['pointer-events'] = 'none'

        this.context = this.canvas.getContext('2d');
        this.resize(1280, 720)

        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';
        // this.imgDiv = imgDiv;
        this._initDraw();
        // this._draw(this.canvas, this.context);
        this._initPaint()
        // this.setColor();
        // this.setBrush();
        // this.preClick();
        // this.nextClick();
        // this.clearClick();
        // this.drawImage(oCanvas);
        this.createPng()
        input.on(InputEvent.KEY_DOWN, (e) => {
            console.log(e)

            let k = e.key.toLowerCase()
            let isCtrl = e.ctrlKey
            let isShift = e.shiftKey
            if (k == 'z') {
                if (isCtrl) {
                    isShift ? this._redo() : this._undo()
                }
            }
        })
    }
    set x(v) {
        this._x = v
        this.canvas.style.left = v + 'px'
    }
    set y(v) {
        this._y = v
        this.canvas.style.top = v + 'px'
    }

    resize(width, height) {
        this.canvas.width = width
        this.canvas.height = height
    }
    _initDraw() {
        var preData = this.context.getImageData(0, 0, this.width, this.height);
        //空绘图表面进栈
        this.middleAry.push(preData);
    }
    _initPaint() {
        const wintab = require('addon/node-wintab');
        var moveFuncID = null
        var upFuncID = null
        input.on(InputEvent.MOUSE_DOWN, (e) => {
            var x = e.mx,
                y = e.my,
                canvasX = x - this._x,
                canvasY = y - this._y;
            console.log('down', x, y)
            this._setCanvasStyle();
            if (wintab.allData().pressure) {
                this.context.lineWidth = this.confing.lineWidth * wintab.allData().pressure
            }
            //清除子路径
            this.context.beginPath();
            this.context.moveTo(canvasX, canvasY);
            //当前绘图表面状态
            var preData = this.context.getImageData(0, 0, this.width, this.height);
            //当前绘图表面进栈
            this.preDrawAry.push(preData);
            const step = 15;
            var countStep = 0;

            var p1, p2,p3
            moveFuncID = input.on(InputEvent.MOUSE_MOVE, (e) => {
                var x2 = e.clientX,
                    y2 = e.clientY,
                    canvasX2 = x2 - this._x,// - left,
                    canvasY2 = y2 - this._y //- top;

                // while (countStep++ < step)
                //     return;
                // countStep = 0
                // if (!p1) {
                //     p1 = { x: canvasX2, y: canvasY2 }
                //     return
                // }
                // if (!p2) {
                //     p2 = { x: canvasX2, y: canvasY2 }
                //     return
                // }
                // if (!p3) {
                //     p3 = { x: canvasX2, y: canvasY2 }
                // }
                

                // if (wintab.allData().pressure) {
                //     this.context.lineWidth = this.confing.lineWidth * wintab.allData().pressure
                // }
                if (canvasX2 >= 0 && canvasY2 >= 0) {
                    this.context.lineTo(canvasX2, canvasY2);
                    // this.context.moveTo(p1.x,p1.y)
                    // this.context.quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
                    // this.context.bezierCurveTo(canvasX2, canvasY2);
                    this.context.stroke();

                    // p1 = p3
                    //  p2 = p3=null
                }
                else {
                    this.context.beginPath();
                }
            })

            upFuncID = input.on(InputEvent.MOUSE_UP, (e) => {
                input.del(InputEvent.MOUSE_UP, upFuncID)
                input.del(InputEvent.MOUSE_MOVE, moveFuncID)

                //当前绘图表面状态
                var preData = this.context.getImageData(0, 0, this.width, this.height);
                if (this.nextDrawAry.length == 0) {
                    //当前绘图表面进栈
                    this.middleAry.push(preData);
                } else {
                    this.middleAry = [];
                    this.middleAry = this.middleAry.concat(this.preDrawAry);
                    this.middleAry.push(preData);
                    this.nextDrawAry = [];
                }
            })
        })
    }
    getImg() {
        var url = this.canvas.toDataURL('image/png'),
            img = new Image();
        img.src = url;
        return img
    }

    createPng() {
        let canvas = document.createElement("canvas");
        canvas.width = this.width
        canvas.height = this.height
        canvas.getContext('2d').clearRect(0, 0, this.width, this.height);
        let img = new Image();
        let imgData = canvas.toDataURL('image/png')
        img.src = imgData
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        const fs = require('fs')
        fs.writeFile("out.png", dataBuffer, function (err) {
        });
        return img
    }

    _redo() {
        console.log('redo')
        if (this.nextDrawAry.length) {
            var popData = this.nextDrawAry.pop();
            var midData = this.middleAry[this.middleAry.length - this.nextDrawAry.length - 2];
            this.preDrawAry.push(midData);
            this.context.putImageData(popData, 0, 0);
        }
    }
    _undo() {
        if (this.preDrawAry.length > 0) {
            var popData = this.preDrawAry.pop();
            var midData = this.middleAry[this.preDrawAry.length + 1];
            this.nextDrawAry.push(midData);
            this.context.putImageData(popData, 0, 0);
        }
    }

    _clear() {
        var data = this.middleAry[0];
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.preDrawAry = [];
        this.nextDrawAry = [];
        this.middleAry = [this.middleAry[0]];
    }

    _setCanvasStyle() {

        this.context.lineWidth = this.confing.lineWidth;
        // this.context.shadowBlur = this.confing.shadowBlur;
        // this.context.shadowColor = this.confing.lineColor;
        this.context.strokeStyle = this.confing.lineColor;
    }
}