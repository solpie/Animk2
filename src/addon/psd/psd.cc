#include <node.h>
#include <v8.h>
#include "psd_file.hpp"
using namespace v8;

void Init(Handle<Object> exports)
{
  Isolate *isolate = Isolate::GetCurrent();
  exports->Set(String::NewFromUtf8(isolate, "psdMake"),
               FunctionTemplate::New(isolate, psd_make)->GetFunction());
}

NODE_MODULE(addon, Init)