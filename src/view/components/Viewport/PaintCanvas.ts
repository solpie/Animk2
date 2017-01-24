import { input, InputEvent } from '../../model/Input';
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
        lineWidth: 1,
        lineColor: "blue",
        shadowBlur: 0
    }
    canvas: any
    context: any
    constructor() {
        this.canvas = document.getElementById('paintCanvas')
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 1280
        this.canvas.height = 720
        // this.colorDiv = oColor;
        // this.brushDiv = oBrush;
        // this.controlDiv = oControl;
        // this.drawImageDiv = oDrawImage;


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

    _initDraw() {
        var preData = this.context.getImageData(0, 0, 1280, 720);
        //空绘图表面进栈
        this.middleAry.push(preData);
    }

    //涂鸦主程序
    _draw(oCanvas, context) {
        var _this1 = this;
        oCanvas.onmousedown = function (e) {
            var x = e.clientX,
                y = e.clientY,
                left = this.parentNode.offsetLeft,
                top = this.parentNode.offsetTop,
                canvasX = x,
                canvasY = y;
            console.log('down', x, y)
            _this1._setCanvasStyle();
            //清除子路径
            _this1.context.beginPath();
            _this1.context.moveTo(canvasX, canvasY);
            //当前绘图表面状态
            var preData = _this1.context.getImageData(0, 0, 1280, 720);
            //当前绘图表面进栈
            _this1.preDrawAry.push(preData);
            oCanvas.onmousemove = function (e) {
                var x2 = e.clientX,
                    y2 = e.clientY,
                    t = e.target,
                    canvasX2 = x2,// - left,
                    canvasY2 = y2 //- top;
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
                    var preData = _this1.context.getImageData(0, 0, 1280, 720);
                    if (_this1.nextDrawAry.length == 0) {
                        //当前绘图表面进栈
                        _this1.middleAry.push(preData);
                    } else {
                        _this1.middleAry = [];
                        _this1.middleAry = _this1.middleAry.concat(_this1.preDrawAry);
                        _this1.middleAry.push(preData);
                        _this1.nextDrawAry = [];
                        // $('.js-next-control').addClass('next-control');
                        // $('.next-control').removeClass('js-next-control');
                    }

                    // _this._isDraw();
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
        this.context.shadowBlur = this.confing.shadowBlur;
        this.context.shadowColor = this.confing.lineColor;
        this.context.strokeStyle = this.confing.lineColor;
    }
}