var addon = require('./build/Release/psd.node')
var width = 1280,
    height = 720;
// addon.psdMake("d:\\1.psd", width, height, ["d:\\test.png", "d:\\makepng.png"], function(msg) {
//     console.log(msg);
// });
addon.pngLoad("d:\\test.png", function(buf, w, h) {
    console.log(w, h, buf);
})