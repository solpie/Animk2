import { colorToHex } from '../../../utils/anmkp/AnpUtil';
import { Brush } from '../../../utils/anmkp/Brush';
import { Painter } from '../../../utils/anmkp/Painter';
import { input, InputEvent } from '../../../utils/Input';

export class PaintView {
    private painter: Painter
    private _x: number
    private _y: number

    rectWidth: number
    rectHeight: number

    private parentRect = { x: 0, y: 0, w: 0, h: 0 }
    setParentRect(options: { x?: number, y?: number, width?: number, height?: number }) {
        if (options.height)
            this.parentRect.h = options.height
    }
    constructor(width, height) {
        this.rectWidth = width
        this.rectHeight = height
        let painter = new Painter()
        painter.lockHistory();
        painter.setCanvasSize(width, height, 0, 0)
        // painter.addLayer();
        // painter.fillLayer('#fff');
        // painter.selectLayer(1);
        painter.unlockHistory();
        this.painter = painter;

        var brush = new Brush();
        brush.setSize(20);
        brush.setColor('#fff');
        brush.setSpacing(0.2);

        painter.setTool(brush);
        painter.setToolStabilizeLevel(10);
        painter.setToolStabilizeWeight(0.5);

        document.body.appendChild(painter.$el)

        var moveFuncId = null, upFuncId = null

    }
    initEvent() {
        input.on(InputEvent.MOUSE_DOWN, (e) => {
            this.onDown(e)
        })
    }
    updateShowRect() {
        this.rectHeight = this.parentRect.h - this.y;
        this.rectHeight /= this.painter.scale
        this.painter.setShowRect(null, null, this.rectWidth, this.rectHeight)
    }
    zoom(scale) {
        this.painter.zoom(scale)
    }

    set x(v) {
        this._x = v
        this.painter.$el.style.left = v + "px"
    }
    set y(v) {
        this._y = v
        this.painter.$el.style.top = v + "px"
    }
    get x() { return this._x }
    get y() { return this._y }
    moveFuncId = null
    upFuncId = null

    onDown(e) {
        // setPointerEvent(e);
        var pointerPosition = this.getRelativePosition(e.clientX, e.clientY);
        console.log(pointerPosition)
        // if (pointerEventsNone)
        //     canvasArea.style.setProperty('cursor', 'none');
        // if (e.pointerType === "pen" && e.button == 5)
        //     painter.setPaintingKnockout(true);
        this.painter.down(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
        this.moveFuncId = input.on(InputEvent.MOUSE_MOVE, (e) => {
            this.onMove(e)
        })
        this.upFuncId = input.on(InputEvent.MOUSE_UP, (e) => {
            this.onUp(e)
        })
    }

    onMove(e) {
        // setPointerEvent(e);
        var pointerPosition = this.getRelativePosition(e.clientX, e.clientY);
        this.painter.move(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
    }

    onUp(e) {
        // setPointerEvent(e);
        var pointerPosition = this.getRelativePosition(e.clientX, e.clientY);
        // if (pointerEventsNone)
        //     canvasArea.style.setProperty('cursor', 'crosshair');
        this.painter.up(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
        if (e.pointerType === "pen" && e.button == 5)
            setTimeout(function () { this.painter.setPaintingKnockout(false) }, 30);
        input.del(InputEvent.MOUSE_MOVE, this.moveFuncId)
        input.del(InputEvent.MOUSE_UP, this.upFuncId)
    }

    getRelativePosition(absoluteX, absoluteY) {
        return {
            x: (absoluteX - this.x) / this.painter.scale,
            y: (absoluteY - this.y) / this.painter.scale
        };
    }

    setBrushColor(color) {
        this.painter.tool.setColor(colorToHex(color))
    }
}