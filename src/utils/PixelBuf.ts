export const getPixelBufFromImg = (img: HTMLImageElement) => {
    let canvas = document.createElement("canvas");
    canvas.width = img.width
    canvas.height = img.height
    let context = canvas.getContext('2d')
    context.drawImage(img, 0, 0);
    var pixel:ImageData = context.getImageData(0, 0, img.width, img.height);

    return pixel.data
    // return new Uint8Array(pixel.data.buffer)
}