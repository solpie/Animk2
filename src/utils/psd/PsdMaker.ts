// import { PsdParser } from '../psd2png/PsdParser';
// import { Layer } from './Layer';
// import { PsdImage } from './PsdImage';

// class PsdMaker {
//     constructor() {
//         //this.compPngArr2PSD([]);
//         //this.psd2png();
//     }


//     psd2png() {
//         var psdParser = new PsdParser();
//         var psd = psdParser.parse("../test/comp.psd");
//         //psd.getDescendants();
//         //psd.getTree();
//         psd.getDescendants()[0].saveAsPng('../test/psd2png2.png');
//         console.log(this, "psd2png");
//         //return;
//     }
//     // static makePsd(img,)
//     /**
//      * Alpha blend with white background
//      * @param srcColor {number} source color (0-255)
//      * @param srcAlpha {number} source alpha (0-255)
//      * @return {number} alpha blended color (0-255)
//      */
//     alphaBlendWithWhite(srcColor, srcAlpha) {
//         var MAX = 255,
//             MIN = 0,
//             ALPHA_MAX = 1,
//             WHITE = 255;
//         if (srcAlpha === MAX) return srcColor;
//         if (srcAlpha === MIN) return MAX;

//         var alpha = srcAlpha / MAX;
//         return Math.round((srcColor * alpha) + (WHITE * (ALPHA_MAX - alpha)));
//     }
// }