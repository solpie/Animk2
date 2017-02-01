import { getPixelBufFromImg } from '../../utils/PixelBuf';
class ImageCache {
    _imgMap: any
    _texMap: any
    _pixelBufMap: any
    constructor() {
        this._imgMap = {}
        this._texMap = {}
        this._pixelBufMap = {}
    }
    
    setImg(filename, img: HTMLImageElement, cachePixbuf = true) {
        if (!this._imgMap[filename]) {
            this._imgMap[filename] = img
            this._pixelBufMap[filename] = getPixelBufFromImg(img)
        }
    }

    getImg(filename, reload = false) {
        return this._imgMap[filename]
    }

    getBuf(filename) {
        return this._pixelBufMap[filename]
    }
}
export const imgCache = new ImageCache()