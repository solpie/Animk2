#include <node.h>
#include <v8.h>
using namespace v8;
#include "psd_system.hpp"

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
    psd_color_mode_bitmap = 0,
    psd_color_mode_grayscale = 1,
    psd_color_mode_indexed = 2,
    psd_color_mode_rgb = 3,
    psd_color_mode_cmyk = 4,
    psd_color_mode_multichannel = 7,
    psd_color_mode_duotone = 8,
    psd_color_mode_lab = 9
} psd_color_mode;

typedef struct
{
    void *file;
    int width;
    int height;
    psd_ushort depth;
    psd_color_mode color_mode;
} psd_context;

void psd_header(psd_context *context)
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
    LITTLE2BIG_SHORT(header.number_of_channels, 3);
    // The height of the image in pixels
    LITTLE2BIG_INT(header.height_of_image, context->height);
    LITTLE2BIG_INT(header.width_of_image, context->width);
    // Depth: the number of bits per channel
    // Supported values are 1, 8, and 16.
    LITTLE2BIG_SHORT(header.depth, context->depth);
    // The color mode of the file
    LITTLE2BIG_SHORT(header.color_mode, context->color_mode);

    psd_fwrite((psd_uchar *)&header, sizeof(psd_file_header_binary), context->file);
}
void psd_make(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

    String::Utf8Value param1(args[0]->ToString());
    char *filename = *param1;
    printf("psd file:%s\n", filename);
    Local<Array> input = Local<Array>::Cast(args[1]);
    unsigned int len = input->Length();
    for (unsigned int i = 0; i < len; i++)
    {
        String::Utf8Value file(input->Get(i));
        char *f = *file;
        // files[i] = f;
        printf("png :%s\n", f);
    }
    //write psd file:
    FILE *fp;
    fp = fopen(filename, "wb+");
    if (fp)
    {
        psd_context *context = NULL;
        context = (psd_context *)psd_malloc(sizeof(psd_context));
        context->file = fp;
        context->height = 9;
        context->width = 9;
        context->depth = 8;
        context->color_mode = psd_color_mode_rgb;
        psd_header(context);
        psd_fclose(fp);
    }
    //
    ///
    Local<Function> cb = Local<Function>::Cast(args[2]);
    const unsigned argc = 1;
    Local<Value> argv[argc] = {String::NewFromUtf8(isolate, "end")};
    cb->Call(Null(isolate), argc, argv);
}