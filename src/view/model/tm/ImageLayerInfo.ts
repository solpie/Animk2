import { Layer } from '../../../utils/psd/Layer';
import { PsdFile } from '../../../utils/psd/PsdFile';
import { PsdImage } from '../../../utils/psd/PsdImage';
const fs = require('fs')
export class ImageLayerInfo { //glue ImageInfo and PsdLayer
    width: number;
    height: number;
    opacity: number = 1;
    isRef: boolean;
    pixels: Uint8ClampedArray;
    buf: Buffer;
    filename: string;
    // imageInfo: ImageInfo;

    constructor() {
        //console.log(this, "new PngLayerData");
    }


    static png2psd(pngArr: Array<ImageLayerInfo>, w, h, colorSpace, path: string, pathCallback) {
        // create psd data
        var psd = new PsdFile(w, h, colorSpace);

        // append layer

        var pngLayer: ImageLayerInfo;
        for (var i = 0; i < pngArr.length; i++) {
            pngLayer = pngArr[i];
            //todo import PsdFile only
            var image = new PsdImage(pngLayer.width, pngLayer.height,
                colorSpace, pngLayer.pixels || pngLayer.buf);
            var layer = new Layer();
            layer.drawImage(image);
            layer.opacity = pngLayer.opacity;
            psd.appendLayer(layer);
        }

        // create merged image data
        var b = new Buffer(4);
        psd.imageData = new PsdImage(1, 1,
            colorSpace, b);

        fs.writeFile(path, psd.toBinary(), (err) => {
            if (err) throw err;
            pathCallback(path);
        });
    }
}