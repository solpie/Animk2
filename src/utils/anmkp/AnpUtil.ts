// namespace Anmkp {
export const createChecker = function (cellSize, colorA, colorB) {
    cellSize = (cellSize == null) ? 10 : cellSize;
    colorA = (colorA == null) ? '#fff' : colorA;
    colorB = (colorB == null) ? '#ccc' : colorB;
    var size = cellSize + cellSize;
    var checker = document.createElement('canvas');
    checker.width = checker.height = size;
    var context = checker.getContext('2d');
    context.fillStyle = colorB;
    context.fillRect(0, 0, size, size);
    context.fillStyle = colorA;
    context.fillRect(0, 0, cellSize, cellSize);
    context.fillRect(cellSize, cellSize, size, size);
    return checker;
}

export const createBrushPointer = function (brushImage, brushSize, brushAngle,
    threshold, antialias, color) {
    brushSize = brushSize | 0;
    var pointer = document.createElement('canvas');
    var pointerContext = pointer.getContext('2d');
    if (brushSize == 0) {
        pointer.width = 1;
        pointer.height = 1;
        return pointer;
    }
    if (brushImage == null) {
        var halfSize = (brushSize * 0.5) | 0;
        pointer.width = brushSize;
        pointer.height = brushSize;
        pointerContext.fillStyle = '#000';
        pointerContext.beginPath();
        pointerContext.arc(halfSize, halfSize, halfSize, 0, Math.PI * 2);
        pointerContext.closePath();
        pointerContext.fill();
    }
    else {
        var width = brushSize;
        var height = brushSize * (brushImage.height / brushImage.width);
        var toRad = Math.PI / 180;
        var ra = brushAngle * toRad;
        var abs = Math.abs;
        var sin = Math.sin;
        var cos = Math.cos;
        var boundWidth = abs(height * sin(ra)) + abs(width * cos(ra));
        var boundHeight = abs(width * sin(ra)) + abs(height * cos(ra));
        pointer.width = boundWidth;
        pointer.height = boundHeight;
        pointerContext.save();
        pointerContext.translate(boundWidth * 0.5, boundHeight * 0.5);
        pointerContext.rotate(ra);
        pointerContext.translate(width * -0.5, height * -0.5);
        pointerContext.drawImage(brushImage, 0, 0, width, height);
        pointerContext.restore();
    }
    return createAlphaThresholdBorder(
        pointer, threshold, antialias, color);
};

export const createAlphaThresholdBorder = function (image, threshold,
    antialias, color) {
    threshold = (threshold == null) ? 0x80 : threshold;
    color = (color == null) ? '#000' : color;
    var width = image.width;
    var height = image.height;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    try {
        context.drawImage(image, 0, 0, width, height);
    }
    catch (e) {
        return canvas;
    }
    var imageData = context.getImageData(0, 0, width, height);
    var d = imageData.data;
    function getAlphaIndex(index) {
        return d[index * 4 + 3];
    }
    function setRedIndex(index, red) {
        d[index * 4] = red;
    }
    function getRedXY(x, y) {
        var red = d[((y * width) + x) * 4];
        return red ? red : 0;
    }
    function getGreenXY(x, y) {
        var green = d[((y * width) + x) * 4 + 1];
        return green;
    }
    function setColorXY(x, y, red, green, alpha) {
        var i = ((y * width) + x) * 4;
        d[i] = red;
        d[i + 1] = green;
        d[i + 2] = 0;
        d[i + 3] = alpha;
    }
    //threshold
    var pixelCount = (d.length * 0.25) | 0;
    for (var i = 0; i < pixelCount; ++i)
        setRedIndex(i, (getAlphaIndex(i) < threshold) ? 0 : 1);
    //outline
    var x;
    var y;
    for (x = 0; x < width; ++x) {
        for (y = 0; y < height; ++y) {
            if (!getRedXY(x, y)) {
                setColorXY(x, y, 0, 0, 0);
            }
            else {
                var redCount = 0;
                var left = x - 1;
                var right = x + 1;
                var up = y - 1;
                var down = y + 1;
                redCount += getRedXY(left, up);
                redCount += getRedXY(left, y);
                redCount += getRedXY(left, down);
                redCount += getRedXY(right, up);
                redCount += getRedXY(right, y);
                redCount += getRedXY(right, down);
                redCount += getRedXY(x, up);
                redCount += getRedXY(x, down);
                if (redCount != 8)
                    setColorXY(x, y, 1, 1, 255);
                else
                    setColorXY(x, y, 1, 0, 0);
            }
        }
    }
    //antialias
    if (antialias) {
        for (x = 0; x < width; ++x) {
            for (y = 0; y < height; ++y) {
                if (getGreenXY(x, y)) {
                    var alpha = 0;
                    if (getGreenXY(x - 1, y) != getGreenXY(x + 1, y))
                        setColorXY(x, y, 1, 1, alpha += 0x40);
                    if (getGreenXY(x, y - 1) != getGreenXY(x, y + 1))
                        setColorXY(x, y, 1, 1, alpha + 0x50);
                }
            }
        }
    }
    context.putImageData(imageData, 0, 0);
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
    return canvas;
}
export const createFloodFill = function (canvas, x, y, r, g, b, a) {
    var result = document.createElement('canvas');
    var w = result.width = canvas.width;
    var h = result.height = canvas.height;
    if ((x < 0) || (x >= w) || (y < 0) || (y >= h) || !(r || g || b || a))
        return result;
    var originalContext = canvas.getContext('2d');
    var originalData = originalContext.getImageData(0, 0, w, h);
    var od = originalData.data;
    var resultContext = result.getContext('2d');
    var resultData = resultContext.getImageData(0, 0, w, h);
    var rd = resultData.data;
    var targetColor = getColor(x, y);
    var replacementColor = (r << 24) | (g << 16) | (b << 8) | a;
    function getColor(x, y) {
        var index = ((y * w) + x) * 4;
        return (rd[index] ? replacementColor :
            ((od[index] << 24) | (od[index + 1] << 16) |
                (od[index + 2] << 8) | od[index + 3]));
    }
    var queue = [];
    queue.push(x, y);
    while (queue.length) {
        var nx = queue.shift();
        var ny = queue.shift();
        if ((nx < 0) || (nx >= w) || (ny < 0) || (ny >= h) ||
            (getColor(nx, ny) !== targetColor))
            continue;
        var west, east;
        west = east = nx;
        do {
            var wc = getColor(--west, ny);
        } while ((west >= 0) && (wc === targetColor));
        do {
            var ec = getColor(++east, ny);
        } while ((east < w) && (ec === targetColor));
        for (var i = west + 1; i < east; ++i) {
            rd[((ny * w) + i) * 4] = 1;
            var north = ny - 1;
            var south = ny + 1;
            if (getColor(i, north) === targetColor)
                queue.push(i, north);
            if (getColor(i, south) === targetColor)
                queue.push(i, south);
        }
    }
    for (i = 0; i < w; ++i) {
        for (var j = 0; j < h; ++j) {
            var index = ((j * w) + i) * 4;
            if (rd[index] == 0)
                continue;
            rd[index] = r;
            rd[index + 1] = g;
            rd[index + 2] = b;
            rd[index + 3] = a;
        }
    }
    resultContext.putImageData(resultData, 0, 0);
    return result;
}
export function colorToHex(color) {
    return '#' + color.toString(16);
};

export const Random = { LFSR113: null }
Random.LFSR113 = function (seed) {
    var IA = 16807;
    var IM = 2147483647;
    var IQ = 127773;
    var IR = 2836;
    var a, b, c, d, e;
    this.get = function () {
        var f = ((a << 6) ^ a) >> 13;
        a = ((a & 4294967294) << 18) ^ f;
        f = ((b << 2) ^ b) >> 27;
        b = ((b & 4294967288) << 2) ^ f;
        f = ((c << 13) ^ c) >> 21;
        c = ((c & 4294967280) << 7) ^ f;
        f = ((d << 3) ^ d) >> 12;
        d = ((d & 4294967168) << 13) ^ f;
        return (a ^ b ^ c ^ d) * 2.3283064365386963e-10 + 0.5;
    }
    seed |= 0;
    if (seed <= 0) seed = 1;
    e = (seed / IQ) | 0;
    seed = (((IA * (seed - ((e * IQ) | 0))) | 0) - ((IR * e) | 0)) | 0;
    if (seed < 0) seed = (seed + IM) | 0;
    if (seed < 2) a = (seed + 2) | 0; else a = seed;
    e = (seed / IQ) | 0;
    seed = (((IA * (seed - ((e * IQ) | 0))) | 0) - ((IR * e) | 0)) | 0;
    if (seed < 0) seed = (seed + IM) | 0;
    if (seed < 8) b = (seed + 8) | 0; else b = seed;
    e = (seed / IQ) | 0;
    seed = (((IA * (seed - ((e * IQ) | 0))) | 0) - ((IR * e) | 0)) | 0;
    if (seed < 0) seed = (seed + IM) | 0;
    if (seed < 16) c = (seed + 16) | 0; else c = seed;
    e = (seed / IQ) | 0;
    seed = (((IA * (seed - ((e * IQ) | 0))) | 0) - ((IR * e) | 0)) | 0;
    if (seed < 0) seed = (seed + IM) | 0;
    if (seed < 128) d = (seed + 128) | 0; else d = seed;
    this.get();
}