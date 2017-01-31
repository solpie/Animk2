import { EventDispatcher } from '../EventDispatcher';
import {Brush} from './Brush'

export class Painter extends EventDispatcher {
    domElement: any
    undoStack = []
    redoStack = []
    undoLimit = 10
    preventPushUndo = false
    pushToTransaction = false


    size = { width: 1280, height: 720 };


    constructor() {
        super()
        this.domElement = document.createElement('div');
        this.setTool(new Brush());
    }

    getRelativePosition(absoluteX, absoluteY) {
        var rect = this.domElement.getBoundingClientRect();
        return { x: absoluteX - rect.left, y: absoluteY - rect.top };
    }

    getUndoLimit() {
        return this.undoLimit
    }

    setUndoLimit(limit) {
        this.undoLimit = limit
    }

    lockHistory() {
        this.preventPushUndo = true;
    };
    unlockHistory() {
        this.preventPushUndo = false;
    };
    beginHistoryTransaction() {
        this.undoStack.push([]);
        this.pushToTransaction = true;
    };
    endHistoryTransaction() {
        this.pushToTransaction = false;
    };

    pushUndo(undoFunction) {
        if (this.preventPushUndo)
            return;
        this.redoStack = [];
        if (this.pushToTransaction)
            this.undoStack[this.undoStack.length - 1].push(undoFunction);
        else
            this.undoStack.push([undoFunction]);
        while (this.undoStack.length > this.undoLimit)
            this.undoStack.shift();
    }

    undo() {
        if (this.pushToTransaction)
            throw 'transaction is not ended';
        if (this.preventPushUndo)
            throw 'history is locked';
        if (this.isDrawing || this.isStabilizing)
            throw 'still drawing';
        if (this.undoStack.length == 0)
            throw 'no more undo data';
        var undoTransaction = this.undoStack.pop();
        var redoTransaction = [];
        while (undoTransaction.length)
            redoTransaction.push(undoTransaction.pop()());
        this.redoStack.push(redoTransaction);
    }

    redo() {
        if (this.pushToTransaction)
            throw 'transaction is not ended';
        if (this.preventPushUndo)
            throw 'history is locked';
        if (this.isDrawing || this.isStabilizing)
            throw 'still drawing';
        if (this.redoStack.length == 0)
            throw 'no more redo data';
        var redoTransaction = this.redoStack.pop();
        var undoTransaction = [];
        while (redoTransaction.length)
            undoTransaction.push(redoTransaction.pop()());
        this.undoStack.push(undoTransaction);
    };
    pushSwapLayerUndo(layerA, layerB) {
        var swap = () => {
            this.lockHistory();
            this.swapLayer(layerA, layerB);
            this.unlockHistory();
            return swap;
        }
        this.pushUndo(swap);
    }
    pushAddLayerUndo(index) {
        var add = () => {
            this.lockHistory();
            this.addLayer(index);
            this.unlockHistory();
            return remove;
        }
        var remove = () => {
            this.lockHistory();
            this.removeLayer(index);
            this.unlockHistory();
            return add;
        }
        this.pushUndo(remove);
    }

    pushRemoveLayerUndo(index) {
        var layerContext = this.getLayerContext(index);
        var w = this.size.width;
        var h = this.size.height;
        var snapshotData = layerContext.getImageData(0, 0, w, h);
        var add = () => {
            this.lockHistory();
            this.addLayer(index);
            var layerContext = this.getLayerContext(index);
            layerContext.putImageData(snapshotData, 0, 0);
            this.unlockHistory();
            return remove;
        }
        var remove = () => {
            this.lockHistory();
            this.removeLayer(index);
            this.unlockHistory();
            return add;
        }
        this.pushUndo(add);
    }


    pushDirtyRectUndo(x, y, width, height, index?) {
        index = (index == null) ? this.layerIndex : index;
        var w = this.size.width;
        var h = this.size.height;
        var right = x + width;
        var bottom = y + height;
        x = Math.min(w, Math.max(0, x));
        y = Math.min(h, Math.max(0, y));
        width = Math.min(w, Math.max(x, right)) - x;
        height = Math.min(h, Math.max(y, bottom)) - y;
        if ((x % 1) > 0)
            ++width;
        if ((y % 1) > 0)
            ++height;
        x = x | 0;
        y = y | 0;
        width = Math.min(w - x, Math.ceil(width));
        height = Math.min(h - y, Math.ceil(height));
        if ((width == 0) || (height == 0)) {
            var doNothing = function () {
                return doNothing;
            }
            this.pushUndo(doNothing);
        }
        else {
            var layerContext = this.getLayerContext(index);
            var snapshotData = layerContext.getImageData(x, y, width, height);
            var swap = function () {
                var layerContext = this.getLayerContext(index);
                var tempData = layerContext.getImageData(x, y, width, height);
                layerContext.putImageData(snapshotData, x, y);
                snapshotData = tempData;
                return swap;
            }
            this.pushUndo(swap);
        }
        if (this.renderDirtyRect)
            this.drawDirtyRect(x, y, width, height);
    }
    pushContextUndo(index?) {
        index = (index == null) ? this.layerIndex : index;
        this.pushDirtyRectUndo(0, 0, this.size.width, this.size.height, index);
    }
    getCanvasSize() {
        return { width: this.size.width, height: this.size.height }; //clone size
    };

    setCanvasSize(width, height, offsetX, offsetY) {
        offsetX = (offsetX == null) ? 0 : offsetX;
        offsetY = (offsetY == null) ? 0 : offsetY;
        // pushCanvasSizeUndo(width, height, offsetX, offsetY);
        this.size.width = width = Math.floor(width);
        this.size.height = height = Math.floor(height);
        this.paintingCanvas.width = width;
        this.paintingCanvas.height = height;
        this.dirtyRectDisplay.width = width;
        this.dirtyRectDisplay.height = height;
        this.domElement.style.width = width + 'px';
        this.domElement.style.height = height + 'px';
        for (var i = 0; i < this.layers.length; ++i) {
            var canvas = this.getLayerCanvas(i);
            var context = this.getLayerContext(i);
            var imageData = context.getImageData(0, 0, width, height);
            canvas.width = width;
            canvas.height = height;
            context.putImageData(imageData, offsetX, offsetY);
        }
    };

    getCanvasWidth() {
        return this.size.width;
    };
    setCanvasWidth(width, offsetX) {
        this.setCanvasSize(width, this.size.height, offsetX, 0);
    };
    getCanvasHeight() {
        return this.size.height;
    };
    setCanvasHeight(height, offsetY) {
        this.setCanvasSize(this.size.width, height, 0, offsetY);
    };
    getLayerCanvas(index) {
        return this.layers[index].getElementsByClassName('paint-layer-canvas')[0];
    }
    getLayerContext(index) {
        return this.getLayerCanvas(index).getContext('2d');
    }

    layers = [];
    layerIndex = 0;
    paintingCanvas: any
    paintingContext: any
    dirtyRectDisplay: any
    dirtyRectDisplayContext: any
    renderDirtyRect = false;
    private initPaintCanvas() {
        let paintingCanvas = this.paintingCanvas = document.createElement('canvas');
        this.paintingContext = this.paintingCanvas.getContext('2d');
        paintingCanvas.className = 'paint-painting-canvas';
        paintingCanvas.style.position = 'absolute';

        let dirtyRectDisplay = this.dirtyRectDisplay = document.createElement('canvas');
        this.dirtyRectDisplayContext = dirtyRectDisplay.getContext('2d');
        dirtyRectDisplay.className = 'paint-dirty-rect-display';
        dirtyRectDisplay.style.position = 'absolute';
    }

    sortLayers() {
        while (this.domElement.firstChild)
            this.domElement.removeChild(this.domElement.firstChild);
        for (var i = 0; i < this.layers.length; ++i) {
            var layer = this.layers[i];
            this.domElement.appendChild(layer);
        }
        this.domElement.appendChild(this.dirtyRectDisplay);
    }

    drawDirtyRect(x, y, w, h) {
        var context = this.dirtyRectDisplayContext;
        context.fillStyle = '#f00';
        context.globalCompositeOperation = 'source-over';
        context.fillRect(x, y, w, h);
        if ((w > 2) && (h > 2)) {
            context.globalCompositeOperation = 'destination-out';
            context.fillRect(x + 1, y + 1, w - 2, h - 2);
        }
    }

    getRenderDirtyRect() {
        return this.renderDirtyRect;
    }

    setRenderDirtyRect(render) {
        this.renderDirtyRect = render;
        if (render == false)
            this.dirtyRectDisplayContext.clearRect(0, 0, this.size.width, this.size.height);
    }

    createLayerThumbnail = function (index, width, height) {
        index = (index == null) ? this.layerIndex : index;
        width = (width == null) ? this.size.width : width;
        height = (height == null) ? this.size.height : height;
        var canvas = this.getLayerCanvas(index);
        var thumbnail = document.createElement('canvas');
        var thumbnailContext = thumbnail.getContext('2d');
        thumbnail.width = width;
        thumbnail.height = height;
        thumbnailContext.drawImage(canvas, 0, 0, width, height);
        return thumbnail;
    };

    getLayers = function () {
        return this.layers.concat(); //clone layers
    };
    getLayerCount = function () {
        return this.layers.length;
    };

    addLayer(index) {
        index = (index == null) ? this.layers.length : index;
        //todo:
        this.pushAddLayerUndo(index);
        var layer = document.createElement('div');
        layer.className = 'paint-layer';
        layer.style.visibility = 'visible';
        layer.style.opacity = '1';
        var canvas = document.createElement('canvas');
        canvas.className = 'paint-layer-canvas';
        canvas.width = this.size.width;
        canvas.height = this.size.height;
        canvas.style.position = 'absolute';
        layer.appendChild(canvas);
        this.domElement.appendChild(layer);
        this.layers.splice(index, 0, layer);
        this.sortLayers();
        this.selectLayer(this.layerIndex);
        this.emit('onlayeradd', { index: index });
        return layer;
    }

    removeLayer(index) {
        index = (index == null) ? this.layerIndex : index;
        this.pushRemoveLayerUndo(index);
        this.domElement.removeChild(this.layers[index]);
        this.layers.splice(index, 1);
        if (this.layerIndex == this.layers.length)
            this.selectLayer(this.layerIndex - 1);
        this.sortLayers();
        this.emit('onlayerremove', { index: index });
        // if (self.onLayerRemoved)
        //     self.onLayerRemoved(index);
    };
    removeAllLayer() {
        while (this.layers.length)
            this.removeLayer(0);
    };

    swapLayer(layerA, layerB) {
        this.pushSwapLayerUndo(layerA, layerB);
        var layer = this.layers[layerA];
        this.layers[layerA] = this.layers[layerB];
        this.layers[layerB] = layer;
        this.sortLayers();
        this.emit('onlayerswap', { a: layerA, b: layerB });
    };
    getCurrentLayerIndex() {
        return this.layerIndex;
    };

    selectLayer(index) {
        var lastestLayerIndex = this.layers.length - 1;
        if (index > lastestLayerIndex)
            index = lastestLayerIndex;
        this.layerIndex = index;
        if (this.paintingCanvas.parentElement != null)
            this.paintingCanvas.parentElement.removeChild(this.paintingCanvas);
        this.layers[index].appendChild(this.paintingCanvas);
        this.emit('onlayerselect', { index: index });
    };
    clearLayer(index) {
        index = (index == null) ? this.layerIndex : index;
        this.pushContextUndo(index);
        var context = this.getLayerContext(index);
        context.clearRect(0, 0, this.size.width, this.size.height);
    };


    fillLayer(fillColor, index) {
        index = (index == null) ? this.layerIndex : index;
        this.pushContextUndo(index);
        var context = this.getLayerContext(index);
        context.fillStyle = fillColor;
        context.fillRect(0, 0, this.size.width, this.size.height);
    }
    fillLayerRect(fillColor, x, y, width, height, index) {
        index = (index == null) ? this.layerIndex : index;
        this.pushDirtyRectUndo(x, y, width, height, index);
        var context = this.getLayerContext(index);
        context.fillStyle = fillColor;
        context.fillRect(x, y, width, height);
    }

    floodFill() {
        //todo
    }
    getLayerOpacity() {
        //todo
    }
    setLayerOpacity() {
        //todo
    }
    getLayerVisible() {
        //todo
    }
    setLayerVisible() {
        //todo
    }

    tool: any
    toolStabilizeLevel = 0;
    toolStabilizeWeight = 0.8;
    stabilizer = null;
    stabilizerInterval = 5;
    tick: any
    tickInterval = 20;
    paintingOpacity = 1;
    paintingKnockout = false;

    getTool() {
        return this.tool
    }

    setTool(value) {
        this.tool = value;
        this.paintingContext = this.paintingCanvas.getContext('2d');
        if (this.tool && this.tool.setContext)
            this.tool.setContext(this.paintingContext);
    }

    getPaintingOpacity() {
        return this.paintingOpacity;
    }

    setPaintingOpacity(opacity) {
        this.paintingOpacity = opacity;
        this.paintingCanvas.style.opacity = opacity;
    }

    getPaintingKnockout() {
        return this.paintingKnockout;
    }
    setPaintingKnockout(knockout) {
        this.paintingKnockout = knockout;
        this.paintingCanvas.style.visibility = knockout ? 'hidden' : 'visible';
    }
    getTickInterval() {
        return this.tickInterval;
    }
    setTickInterval(interval) {
        this.tickInterval = interval;
    }
    /*
    stabilize level is the number of coordinate tracker.
    higher stabilize level makes lines smoother.
    */
    getToolStabilizeLevel() {
        return this.toolStabilizeLevel;
    }
    setToolStabilizeLevel(level) {
        this.toolStabilizeLevel = (level < 0) ? 0 : level;
    }
    /*
    higher stabilize weight makes trackers follow slower.
    */
    getToolStabilizeWeight() {
        return this.toolStabilizeWeight;
    }
    setToolStabilizeWeight(weight) {
        this.toolStabilizeWeight = weight;
    }
    getToolStabilizeInterval() {
        return this.stabilizerInterval;
    }
    setToolStabilizeInterval(interval) {
        this.stabilizerInterval = interval;
    }

    isDrawing = false;
    isStabilizing = false;
    beforeKnockout = document.createElement('canvas');
    knockoutTick;
    knockoutTickInterval = 20;

    gotoBeforeKnockout() {
        var context = this.getLayerContext(this.layerIndex);
        var w = this.size.width;
        var h = this.size.height;
        context.clearRect(0, 0, w, h);
        context.drawImage(this.beforeKnockout, 0, 0, w, h);
    }
    drawPaintingCanvas() { //draw painting canvas on current layer
        var context = this.getLayerContext(this.layerIndex);
        var w = this.size.width;
        var h = this.size.height;
        context.save();
        context.globalAlpha = this.paintingOpacity;
        context.globalCompositeOperation = this.paintingKnockout ?
            'destination-out' : 'source-over';
        context.drawImage(this.paintingCanvas, 0, 0, w, h);
        context.restore();
    }
    _move(x, y, pressure) {
        if (this.tool.move)
            this.tool.move(x, y, pressure);
        this.emit('onmove', { x: x, y: y, pressure: pressure });
        // if (self.onMoved)
        //     self.onMoved(x, y, pressure);
    }
    _up(x, y, pressure) {
        this.isDrawing = false;
        this.isStabilizing = false;
        var dirtyRect;
        if (this.tool.up)
            dirtyRect = this.tool.up(x, y, pressure);
        if (this.paintingKnockout)
            this.gotoBeforeKnockout();
        if (dirtyRect)
            this.pushDirtyRectUndo(dirtyRect.x, dirtyRect.y,
                dirtyRect.width, dirtyRect.height);
        else
            this.pushContextUndo();
        this.drawPaintingCanvas();
        this.paintingContext.clearRect(0, 0, this.size.width, this.size.height);
        dirtyRect = dirtyRect ||
            { x: 0, y: 0, width: this.size.width, height: this.size.height };
        this.emit('onup',
            { x: x, y: y, pressure: pressure, dirtyRect: dirtyRect });
        // if (self.onUpped)
        //     self.onUpped(x, y, pressure, dirtyRect);
        window.clearInterval(this.knockoutTick);
        window.clearInterval(this.tick);
    }

    down(x, y, pressure) {
        if (this.isDrawing || this.isStabilizing)
            throw 'still drawing';
        this.isDrawing = true;
        if (this.tool == null)
            return;
        if (this.paintingKnockout) {
            var w = this.size.width;
            var h = this.size.height;
            var canvas = this.getLayerCanvas(this.layerIndex);
            var beforeKnockoutContext = this.beforeKnockout.getContext('2d');
            this.beforeKnockout.width = w;
            this.beforeKnockout.height = h;
            beforeKnockoutContext.clearRect(0, 0, w, h);
            beforeKnockoutContext.drawImage(canvas, 0, 0, w, h);
        }
        //todo   
        // pressure = (pressure == null) ? .Tablet.pressure() : pressure;
        var down = this.tool.down;
        if (this.toolStabilizeLevel > 0) {
            this.stabilizer = new Anmkp.Stabilizer(down, this._move, this._up,
                this.toolStabilizeLevel, this.toolStabilizeWeight,
                x, y, pressure, this.stabilizerInterval);
            this.isStabilizing = true;
        }
        else if (down != null)
            down(x, y, pressure);
        this.emit('ondown', { x: x, y: y, pressure: pressure });
        // if (this.onDowned)
        //     self.onDowned(x, y, pressure);
        this.knockoutTick = window.setInterval(function () {
            if (this.paintingKnockout) {
                this.gotoBeforeKnockout();
                this.drawPaintingCanvas();
            }
        }, this.knockoutTickInterval);
        this.tick = window.setInterval(function () {
            if (this.tool.tick)
                this.tool.tick();
            this.emit('ontick');
            // if (self.onTicked)
            //     self.onTicked();
        }, this.tickInterval);
    };
    move(x, y, pressure) {
        if (!this.isDrawing)
            throw 'you need to call \'down\' first';
        if (this.tool == null)
            return;
        //todo
        // pressure = (pressure == null) ? .Tablet.pressure() : pressure;
        if (this.stabilizer != null)
            this.stabilizer.move(x, y, pressure);
        else if (!this.isStabilizing)
            this._move(x, y, pressure);
    };
    up(x, y, pressure) {
        if (!this.isDrawing)
            throw 'you need to call \'down\' first';
        if (this.tool == null) {
            this.isDrawing = false;
            return;
        }
        //todo
        // pressure = (pressure == null) ? .Tablet.pressure() : pressure;
        if (this.stabilizer != null)
            this.stabilizer.up(x, y, pressure);
        else
            this._up(x, y, pressure);
        this.stabilizer = null;
    };
}