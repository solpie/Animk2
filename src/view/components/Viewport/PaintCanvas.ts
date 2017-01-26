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
        shadowBlur: 0.5
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
        this.context = this.canvas.getContext('2d');
        this.resize(1280, 720)

        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';
        // this.imgDiv = imgDiv;
        this._initDraw();
        this._draw(this.canvas, this.context);
        // this.setColor();
        // this.setBrush();
        // this.preClick();
        // this.nextClick();
        // this.clearClick();
        // this.drawImage(oCanvas);

        input.on(InputEvent.KEY_DOWN, (e) => {
            console.log(e)

            let k = e.key.toLowerCase()
            let isCtrl = e.ctrlKey
            let isShift = e.shiftKey
            if (k == 'z') {
                if (isCtrl) {
                    if (isShift)
                        this._redo()
                    else
                        this._undo()
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

    //涂鸦主程序
    _draw(oCanvas, context) {
        var _this1 = this;
        var pressure;
        var wintab = require('addon/node-wintab');
        oCanvas.onmousedown = function (e) {
            var x = e.clientX,
                y = e.clientY,
                left = this.parentNode.offsetLeft,
                top = this.parentNode.offsetTop,
                canvasX = x-_this1._x,
                canvasY = y-_this1._y;
            console.log('down', x, y)
            _this1._setCanvasStyle();
            if (wintab.allData().pressure) {
                _this1.context.lineWidth = _this1.confing.lineWidth * wintab.allData().pressure
            }
            //清除子路径
            _this1.context.beginPath();
            _this1.context.moveTo(canvasX, canvasY);
            //当前绘图表面状态
            var preData = _this1.context.getImageData(0, 0, this.width, this.height);
            //当前绘图表面进栈
            _this1.preDrawAry.push(preData);
            oCanvas.onmousemove = function (e) {
                var x2 = e.clientX,
                    y2 = e.clientY,
                    t = e.target,
                    canvasX2 = x2-_this1._x,// - left,
                    canvasY2 = y2-_this1._y //- top;
                if (wintab.allData().pressure) {
                    _this1.context.lineWidth = _this1.confing.lineWidth * wintab.allData().pressure
                }
                if (t == oCanvas) {
                    _this1.context.lineTo(canvasX2, canvasY2);
                    _this1.context.stroke();
                } else {
                    _this1.context.beginPath();
                }
            }
            oCanvas.onmouseup = function (e) {
                var t = e.target;
                if (t == oCanvas) {
                    //当前绘图表面状态
                    var preData = _this1.context.getImageData(0, 0, this.width, this.height);
                    if (_this1.nextDrawAry.length == 0) {
                        //当前绘图表面进栈
                        _this1.middleAry.push(preData);
                    } else {
                        _this1.middleAry = [];
                        _this1.middleAry = _this1.middleAry.concat(_this1.preDrawAry);
                        _this1.middleAry.push(preData);
                        _this1.nextDrawAry = [];
                    }
                }
                this.onmousemove = null;
            }
        }
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