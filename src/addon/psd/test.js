var addon = require('./build/Release/psd.node')
addon.psdMake("d:\\1.psd", ["d:\\test.png", "d:\\makepng.png"], function(msg) {
    console.log(msg);
});