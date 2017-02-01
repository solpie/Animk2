class ImageCache {
    _imgMap: any
    _texMap: any
    constructor() {
        this._imgMap = {}
        this._texMap = {}
    }
    setImg(filename, img: HTMLImageElement) {
        if (!this._imgMap[filename])
            this._imgMap[filename] = img
    }
    getImg(filename, reload = false) {
        return this._imgMap[filename]
    }
}
export const imgCache = new ImageCache()