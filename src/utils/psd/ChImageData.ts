export class ChImageData {
    width;
    height;
    pixels: Array<number>;
    buf: Buffer
    toBinCount = 0;
    constructor(width, height, pixels: Array<number>) {
        this.width = width;
        this.height = height;
        this.pixels = pixels;
    }

    compressRLE() {
        // RLE compress
        var width = this.width;
        var height = this.height;
        var compressedLines = [];
        var byteCounts = new Buffer(this.height * 2);
        byteCounts.fill(0);

        var ofs = 0;
        for (var i = 0; i < height; i++) {
            // read line data
            var start = i * width;
            var end = start + width;
            var compressedLine = this.encodeRLE(this.pixels.slice(start, end));
            compressedLines.push(compressedLine);
            byteCounts.writeUInt16BE(compressedLine.length, ofs);
            ofs += 2;
        }

        return {
            byteCounts: byteCounts,
            image: Buffer.concat(compressedLines)
        };
    }

    encodeRLE(data) {
        var result = [];

        if (data.length === 0) {
            throw new Error('buffer length is 0');
            //return null;
        }

        if (data.length === 1) {
            result.push(0x00);
            result.push(data[0]);
            return new Buffer(result);
        }

        var buf = [];
        var pos = 0;
        var repeatCount = 0;
        var MAX_LENGTH = 127;

        // we can safely start with RAW sa empty RAW sequences
        // are handled by finishRAW()
        var state = 'RAW';

        function finishRAW() {
            if (buf.length === 0) {
                return;
            }
            result.push(buf.length - 1);
            result = result.concat(buf);
            buf = [];
        }

        function finishRLE() {
            result.push(256 - (repeatCount - 1));
            result.push(data[pos]);
        }

        while (pos < data.length - 1) {
            var currentByte = data[pos];

            if (data[pos] === data[pos + 1]) {
                if (state === 'RAW') {
                    // end of RAW data
                    finishRAW();
                    state = 'RLE';
                    repeatCount = 1;
                } else if (state === 'RLE') {
                    if (repeatCount === MAX_LENGTH) {
                        // restart the encoding
                        finishRLE();
                        repeatCount = 0;
                    }
                    // move to next byte
                    repeatCount += 1;
                }
            } else {
                if (state === 'RLE') {
                    repeatCount += 1;
                    finishRLE();
                    state = 'RAW';
                    repeatCount = 0;
                } else if (state === 'RAW') {
                    if (buf.length === MAX_LENGTH) {
                        // restart the encoding
                        finishRAW();
                    }

                    buf.push(currentByte);
                }
            }

            pos += 1;
        }

        if (state === 'RAW') {
            buf.push(data[pos]);
            finishRAW();
        } else if (state === 'RLE') {
            repeatCount += 1;
            finishRLE();
        }

        return new Buffer(result);
    }

    toBinary() {
        if (!this.buf) {
            // set compression type
            var compType = new Buffer(2);
            compType.writeUInt16BE(1, 0); // RLE

            // get RLE compressed data
            var compressedData = this.compressRLE();

            this.buf = Buffer.concat([
                compType, // compression
                compressedData.byteCounts, // byte counts
                compressedData.image // RLE compressed data
            ]);
        }
        return this.buf
    }
}