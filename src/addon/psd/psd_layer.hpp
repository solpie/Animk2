#pragma once
#include "png_file.hpp"

psd_uchar *get_layer_bin(char *pngFilename)
{
    unsigned int w, h;
    unsigned char *pngBuf = png_load(pngFilename, &w, &h);
    int numChannel = 4;

    //4byte align
    char layerName[4];
    layerName[0] = '.';
    layerName[1] = 'p';
    layerName[2] = 'n';
    layerName[3] = 'g';
    int layerRecordSize = 34 + 4 + 4 + sizeof(layerName) + (6 * numChannel);
    psd_uchar *buf = (psd_uchar *)psd_malloc(layerRecordSize);
    
    int top = 0, left = 0;
    // writeUInt32BE(buf, top);
    // writeUInt32BEAt(buf, left, 4);
    // writeUInt32BEAt(buf, top , 8);
    // writeUInt32BEAt(buf, left , 12);
    return buf;
}