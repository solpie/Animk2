#include <node.h>
#include <v8.h>
using namespace v8;
void psd_make(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

    String::Utf8Value filename(args[0]->ToString());
    // Unpack JS array into a std::vector
    // char *files[20];
    // Local<Array> input = Local<Array>::Cast(args[1]);
    // unsigned int len = input->Length();
    // for (unsigned int i = 0; i < len; i++)
    // {
    //     String::Utf8Value file(input->Get(i));
    //     char *f = *file;
    //     files[i] = f;
    // }
    //   char *files[20];
    Local<Array> input = Local<Array>::Cast(args[1]);
    unsigned int len = input->Length();
    for (unsigned int i = 0; i < len; i++)
    {
        String::Utf8Value file(input->Get(i));
        // char *f = *file;
        // files[i] = f;
        // printf("png :%s\n", file);
    }
    Local<Function> cb = Local<Function>::Cast(args[2]);
    const unsigned argc = 1;
    Local<Value> argv[argc] = {String::NewFromUtf8(isolate, "end")};
    cb->Call(Null(isolate), argc, argv);
}