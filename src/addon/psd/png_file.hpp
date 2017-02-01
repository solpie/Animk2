#pragma once
#include "png.h"

/*
func desp: this func supports alpha channel. buffer is BGRA format

*/
unsigned char *png_load(char *filename, unsigned int *width, unsigned int *height)
{
    FILE *fp;
    png_structp png_ptr;
    png_infop info_ptr;
    int ret = -1;
    png_bytep row_buf;
    png_uint_32 y;
    int num_pass, pass;

    //check to see if png type file
    // ret = png_check(filename);
    // if (ret)
    // {
    //     printf("%s is not exist or NOT png format. pls check \n", filename);
    //     return NULL; //it is NOT a png file.
    // }
    //printf( "libpng version is:%s\n", PNG_LIBPNG_VER_STRING);

    //prepare to read png file
    fp = fopen(filename, "rb"); //has pass test. fp will not equal to NULL.
    png_ptr = png_create_read_struct(PNG_LIBPNG_VER_STRING, (void *)NULL, (png_error_ptr)NULL, (png_error_ptr)NULL);
    if (png_ptr == NULL)
    {
        printf("preparing png_ptr... fail\n");
        fclose(fp);
        return NULL;
    }
    info_ptr = png_create_info_struct(png_ptr);
    if (info_ptr == NULL)
    {
        printf("preparing info_ptr... fail\n");
        png_destroy_read_struct(&png_ptr, NULL, NULL);
        fclose(fp);
        return NULL;
    }

    //png_read_png(png_ptr, info_ptr,png_transforms_flag,NULL);		//high level  func
    //init stream I/O func
    png_init_io(png_ptr, fp);         //using standard C API
    png_read_info(png_ptr, info_ptr); //read the file information

    //tell libpng to strip 16 bit depth files down to 8 bits.
    if (info_ptr->bit_depth == 16)
    {
        printf("NOT be supported 16 bit-depth png file operation!\n");
        png_set_strip_16(png_ptr);
    }

    if (info_ptr->pixel_depth != 32)
    {
        printf("NOT be supported non-4-bpp png file operation!\n");
        return NULL;
    }
    /*
	If there is no interlacing (check interlace_type == PNG_INTERLACE_NONE), 
	this is simple:
	png_read_rows(png_ptr, row_pointers, NULL, number_of_rows);
	*/
    if (info_ptr->interlace_type)
    {
        num_pass = png_set_interlace_handling(png_ptr);
    }
    else
    {
        num_pass = 1;
    }

    // Allocate the memory to hold the image using the fields of info_ptr.
    row_buf = (png_bytep)malloc(info_ptr->rowbytes * info_ptr->height * num_pass);

    for (pass = 0; pass < num_pass; pass++)
    {
        for (y = 0; y < info_ptr->height; y++)
        {
            //png_read_row(png_structp png_ptr, png_bytep row, png_bytep dsp_row)
            png_read_row(png_ptr, row_buf + (info_ptr->rowbytes * y) + (info_ptr->rowbytes * info_ptr->height * pass), NULL);
        }
    }

    if (width)
        *width = info_ptr->width;
    if (height)
        *height = info_ptr->height;

    png_read_end(png_ptr, info_ptr);

    png_destroy_read_struct(&png_ptr, &info_ptr, NULL);
    fclose(fp);
    return ((unsigned char *)row_buf);
}
void png_decode(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

    String::Utf8Value param1(args[0]->ToString());
    char *filename = *param1;
    unsigned int w, h;
    unsigned char *pngBuf = png_load(filename, &w, &h);
    ///
    Local<Function> cb = Local<Function>::Cast(args[1]);
    Local<ArrayBuffer> ab = ArrayBuffer::New(isolate, pngBuf, w * h * 4);

    const unsigned argc = 3;
    Local<Value> argv[argc] = {
        // String::NewFromUtf8(isolate, "end"),
         ab,
        Number::New(isolate, w),
        Number::New(isolate, h)};
    cb->Call(Null(isolate), argc, argv);
}