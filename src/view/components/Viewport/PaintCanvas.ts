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
        shadowBlur: 1
    }
    canvas: any
    context: any
    constructor() {
        this.canvas = document.getElementById('paintCanvas')
        this.context = this.canvas.getContext('2d');
        // this.colorDiv = oColor;
        // this.brushDiv = oBrush;
        // this.controlDiv = oControl;
        // this.drawImageDiv = oDrawImage;
        // this.imgDiv = imgDiv;
        this._initDraw();
        this._draw(this.canvas, this.context);
        // this.setColor();
        // this.setBrush();
        // this.preClick();
        // this.nextClick();
        // this.clearClick();
        // this.drawImage(oCanvas);
    }

    _initDraw() {
        var preData = this.context.getImageData(0, 0, 1280, 720);
        //空绘图表面进栈
        this.middleAry.push(preData);
    }

    //涂鸦主程序
    _draw(oCanvas, context) {
        var _this = this;
        oCanvas.onmousedown = function (e) {
            var x = e.clientX,
                y = e.clientY,
                left = this.parentNode.offsetLeft,
                top = this.parentNode.offsetTop,
                canvasX = x - left,
                canvasY = y - top;
            _this._setCanvasStyle();
            //清除子路径
            _this.context.beginPath();
            _this.context.moveTo(canvasX, canvasY);
            //当前绘图表面状态
            var preData = _this.context.getImageData(0, 0, 1280, 720);
            //当前绘图表面进栈
            _this.preDrawAry.push(preData);
            oCanvas.onmousemove = function (e) {
                var x2 = e.clientX,
                    y2 = e.clientY,
                    t = e.target,
                    canvasX2 = x2,// - left,
                    canvasY2 = y2 //- top;
                if (t == oCanvas) {
                    _this.context.lineTo(canvasX2, canvasY2);
                    _this.context.stroke();
                } else {
                    _this.context.beginPath();
                }
            }
            oCanvas.onmouseup = function (e) {
                var t = e.target;
                if (t == oCanvas) {
                    //当前绘图表面状态
                    var preData = _this.context.getImageData(0, 0, 1280, 720);
                    if (_this.nextDrawAry.length == 0) {
                        //当前绘图表面进栈
                        _this.middleAry.push(preData);
                    } else {
                        _this.middleAry = [];
                        _this.middleAry = _this.middleAry.concat(_this.preDrawAry);
                        _this.middleAry.push(preData);
                        _this.nextDrawAry = [];
                        // $('.js-next-control').addClass('next-control');
                        // $('.next-control').removeClass('js-next-control');
                    }

                    // _this._isDraw();
                }
                this.onmousemove = null;
            }
        }
    }

    _setCanvasStyle() {
        this.context.lineWidth = this.confing.lineWidth;
        this.context.shadowBlur = this.confing.shadowBlur;
        this.context.shadowColor = this.confing.lineColor;
        this.context.strokeStyle = this.confing.lineColor;
    }
}