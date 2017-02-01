#include <node.h>
#include <v8.h>
#include "psd_file.hpp"
using namespace v8;
#define export(js, cc) exports->Set(String::NewFromUtf8(isolate, js),FunctionTemplate::New(isolate, cc)->GetFunction());
void Init(Handle<Object> exports)
{
  Isolate *isolate = Isolate::GetCurrent();
  export("psdMake", psd_make);
  export("pngLoad", png_decode);
}

NODE_MODULE(addon, Init)