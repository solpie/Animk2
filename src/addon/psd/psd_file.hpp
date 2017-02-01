#include <node.h>
#include <v8.h>
using namespace v8;
#include "psd_system.hpp"
#include "psd_layer.hpp"
// 26 bytes.
typedef struct
{
    psd_char signature[4];           //Signature: always equal to '8BPS'. Do not try to read the file if the signature does not match this value.
    psd_uchar version[2];            //Version: always equal to 1. Do not try to read the file if the version does not match this value. (**PSB** version is 2.)
    psd_char reserved[6];            //Reserved: must be zero.
    psd_uchar number_of_channels[2]; //The number of channels in the image, including any alpha channels. Supported range is 1 to 56.
    psd_uchar height_of_image[4];    //The height of the image in pixels. Supported range is 1 to 30,000. (**PSB** max of 300,000.)
    psd_uchar width_of_image[4];     //The width of the image in pixels. Supported range is 1 to 30,000. (*PSB** max of 300,000)
    psd_uchar depth[2];              //Depth: the number of bits per channel. Supported values are 1, 8, and 16.
    psd_uchar color_mode[2];         //The color mode of the file. Supported values are: Bitmap = 0; Grayscale = 1; Indexed = 2; RGB = 3; CMYK = 4; Multichannel = 7; Duotone = 8; Lab = 9.
} psd_file_header_binary;

// color mode
typedef enum {
    // psd_color_mode_bitmap = 0,
    // psd_color_mode_grayscale = 1,
    // psd_color_mode_indexed = 2,
    psd_color_mode_rgb = 3
    // psd_color_mode_cmyk = 4,
    // psd_color_mode_multichannel = 7,
    // psd_color_mode_duotone = 8,
    // psd_color_mode_lab = 9
} psd_color_mode;

typedef struct
{
    void *file;
    Local<Array> png_arr;
    //
    int width;
    int height;
    psd_ushort depth;
    psd_color_mode color_mode;

    char *layer_arr[];
} psd_context;

void wb_header(psd_context *context)
{
    psd_file_header_binary header;
    header.signature[0] = '8';
    header.signature[1] = 'B';
    header.signature[2] = 'P';
    header.signature[3] = 'S';

    // Version: always equal to 1
    header.version[0] = 0;
    header.version[1] = 1;

    //clear reserved section
    memset(header.reserved, 0, 6);
    writeUInt16BE(header.number_of_channels, 3);
    // The height of the image in pixels
    writeUInt32BE(header.height_of_image, context->height);
    writeUInt32BE(header.width_of_image, context->width);
    // Depth: the number of bits per channel
    // Supported values are 1, 8, and 16.
    writeUInt16BE(header.depth, context->depth);
    // The color mode of the file
    writeUInt16BE(header.color_mode, context->color_mode);

    psd_fwrite((psd_uchar *)&header, sizeof(psd_file_header_binary), context->file);
}

void wb_color_mode_data(psd_context *context)
{
    psd_uchar *buf = (psd_uchar *)psd_malloc(4);
    psd_fwrite(buf, 4, context->file);
}

void wb_image_resuorce(psd_context *context)
{
    psd_fwrite((psd_uchar *)psd_malloc(4), 4, context->file);
}
void wb_layer_block(psd_context *context)
{
    unsigned int len = context->png_arr->Length();
    if (len == 0)
    {
        psd_fwrite((psd_uchar *)psd_malloc(4), 4, context->file);
        return;
    }
    for (unsigned int i = 0; i < len; i++)
    {
        String::Utf8Value file(context->png_arr->Get(i));
        char *f = *file;
        int size;
        psd_uchar* layerBuf = get_layer_bin(f);
        size = sizeof(layerBuf);
        printf("png :%s size:%d\n", f,size);
        psd_fwrite(layerBuf, sizeof(layerBuf), context->file);
        // files[i] = f;
    }
}
void psd_make(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

    String::Utf8Value param1(args[0]->ToString());
    char *filename = *param1;

    int width = args[1]->NumberValue();
    int height = args[2]->NumberValue();
    // Local<Array> input = Local<Array>::Cast(args[1]);

    //write psd file:
    FILE *fp;
    fp = fopen(filename, "wb+");
    if (fp)
    {
        psd_context *context = NULL;
        context = (psd_context *)psd_malloc(sizeof(psd_context));
        context->file = fp;
        context->png_arr = Local<Array>::Cast(args[3]);
        //
        context->height = height;
        context->width = width;
        context->depth = 8;
        context->color_mode = psd_color_mode_rgb;
        wb_header(context);
        wb_color_mode_data(context);
        wb_image_resuorce(context);
        wb_layer_block(context);
        psd_fclose(fp);
        printf("[new psd file] %s\n", filename);
    }
    //
    ///
    Local<Function> cb = Local<Function>::Cast(args[4]);
    const unsigned argc = 1;
    Local<Value> argv[argc] = {String::NewFromUtf8(isolate, "end")};
    cb->Call(Null(isolate), argc, argv);
}