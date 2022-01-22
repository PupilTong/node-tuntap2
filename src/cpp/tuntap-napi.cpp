#include <napi.h>
#include <netinet/ether.h>
#include <netinet/if_ether.h>

#include <string.h>
#include <uv.h>

#include <cerrno>
#include <string>

#include "tuntap-methods.hh"

[[noreturn]] static void throwErrnoError(Napi::Env env, int code) {
    napi_value error;
    napi_create_error(env, Napi::Value::From(env, uv_err_name(-code)),
                      Napi::Value::From(env, uv_strerror(-code)), &error);

    Napi::Error err(env, error);
    err.Set("errno", Napi::Value::From(env, code));
    throw err;
}

static Napi::Value tuntapInit(const Napi::CallbackInfo& info) {
    const Napi::Env& env = info.Env();
    if (info.Length() != 2) {
        throw Napi::TypeError::New(env, "Wrong number of arguments");
    }
    if (!(info[0].IsNumber() && info[1].IsBoolean())) {
        throw Napi::TypeError::New(env, "Wrong argument(s)!");
    }
    char name[64];
    int result = init(info[0].As<Napi::Number>().Int32Value(),
                      info[1].As<Napi::Boolean>().Value(), name);
    if (result == -1) {
        throwErrnoError(env, errno);
    }
    return Napi::String::From(env, name);
};
static Napi::Value tuntapGetFlags(const Napi::CallbackInfo& info) {
    const Napi::Env& env = info.Env();
    if (info.Length() != 1) {
        throw Napi::TypeError::New(env, "Wrong number of arguments");
    }
    if (!(info[0].IsString())) {
        throw Napi::TypeError::New(env, "Wrong argument(s)!");
    }
    int flag = 0;
    std::string name = info[0].As<Napi::String>().ToString();
    int result = getFlags((char*)name.data(), &flag);
    if (result == -1) {
        throwErrnoError(env, errno);
    }
    return Napi::Number::From(env, flag);
}
static Napi::Value tuntapSetMac(const Napi::CallbackInfo& info) {
    const Napi::Env& env = info.Env();
    if (info.Length() != 2) {
        throw Napi::TypeError::New(env, "Wrong number of arguments");
    }
    if (!(info[0].IsString() && info[1].IsString())) {
        throw Napi::TypeError::New(env, "Wrong argument(s)!");
    }
    std::string name = info[0].As<Napi::String>().ToString();
    std::string mac = info[1].As<Napi::String>().ToString();
    int result = setMac((char*)name.data(), (char*)mac.data());
    if (result == -1) {
        throwErrnoError(env, errno);
    }
    return Napi::Number::From(env, result);
}
static Napi::Value tuntapSetUp(const Napi::CallbackInfo& info) {
    const Napi::Env& env = info.Env();
    if (info.Length() != 1) {
        throw Napi::TypeError::New(env, "Wrong number of arguments");
    }
    if (!(info[0].IsString())) {
        throw Napi::TypeError::New(env, "Wrong argument(s)!");
    }
    std::string name = info[0].As<Napi::String>().ToString();
    int result = setUp((char*)name.data());
    if (result == -1) {
        throwErrnoError(env, errno);
    }
    return Napi::Number::From(env, result);
}
static Napi::Value tuntapSetDown(const Napi::CallbackInfo& info) {
    const Napi::Env& env = info.Env();
    if (info.Length() != 1) {
        throw Napi::TypeError::New(env, "Wrong number of arguments");
    }
    if (!(info[0].IsString())) {
        throw Napi::TypeError::New(env, "Wrong argument(s)!");
    }
    std::string name = info[0].As<Napi::String>().ToString();
    int result = setDown((char*)name.data());
    if (result == -1) {
        throwErrnoError(env, errno);
    }
    return Napi::Number::From(env, result);
}
static Napi::Value tuntapSetMtu(const Napi::CallbackInfo& info) {
    const Napi::Env& env = info.Env();
    if (info.Length() != 2) {
        throw Napi::TypeError::New(env, "Wrong number of arguments");
    }
    if (!(info[0].IsString() && info[1].IsNumber())) {
        throw Napi::TypeError::New(env, "Wrong argument(s)!");
    }
    std::string name = info[0].As<Napi::String>().ToString();
    int result =
        setMtu((char*)name.data(), info[1].As<Napi::Number>().Int32Value());
    if (result == -1) {
        throwErrnoError(env, errno);
    }
    return Napi::Number::From(env, result);
}
static Napi::Value tuntapGetMtu(const Napi::CallbackInfo& info) {
    const Napi::Env& env = info.Env();
    if (info.Length() != 1) {
        throw Napi::TypeError::New(env, "Wrong number of arguments");
    }
    if (!(info[0].IsString())) {
        throw Napi::TypeError::New(env, "Wrong argument(s)!");
    }
    std::string name = info[0].As<Napi::String>().ToString();
    int mtu = 0;
    int result = getMtu((char*)name.data(), &mtu);
    if (result == -1) {
        throwErrnoError(env, errno);
    }
    return Napi::Number::From(env, mtu);
}
static Napi::Value tuntapSetIpv4(const Napi::CallbackInfo& info) {
    const Napi::Env& env = info.Env();
    if (info.Length() != 3) {
        throw Napi::TypeError::New(env, "Wrong number of arguments");
    }
    if (!(info[0].IsString() && info[1].IsString() && info[2].IsNumber())) {
        throw Napi::TypeError::New(env, "Wrong argument(s)!");
    }
    std::string name = info[0].As<Napi::String>().ToString();
    std::string ip = info[1].As<Napi::String>().ToString();
    int mask = info[2].As<Napi::Number>().Int32Value();
    int result = setIpv4Addr((char*)name.data(), (char*)ip.data());
    if ((setIpv4Addr((char*)name.data(), (char*)ip.data()) == -1) ||
        (setIpv4Netmask((char*)name.data(), mask) == -1)) {
        throwErrnoError(env, errno);
    }
    return Napi::Number::From(env, result);
}
static Napi::Value tuntapGetIfIndex(const Napi::CallbackInfo& info) {
    const Napi::Env& env = info.Env();
    if (info.Length() != 1) {
        throw Napi::TypeError::New(env, "Wrong number of arguments");
    }
    if (!(info[0].IsString())) {
        throw Napi::TypeError::New(env, "Wrong argument(s)!");
    }
    std::string name = info[0].As<Napi::String>().ToString();
    int ifindex = 0;
    int result = getIfIndex((char*)name.data(), &ifindex);
    if (result == -1) {
        throwErrnoError(env, errno);
    }
    return Napi::Number::From(env, ifindex);
}
static Napi::Value tuntapSetIpv6(const Napi::CallbackInfo& info) {
    const Napi::Env& env = info.Env();
    if (info.Length() != 3) {
        throw Napi::TypeError::New(env, "Wrong number of arguments");
    }
    if (!(info[0].IsNumber() && info[1].IsString() && info[2].IsNumber())) {
        throw Napi::TypeError::New(env, "Wrong argument(s)!");
    }
    std::string name = info[0].As<Napi::String>().ToString();
    std::string ip = info[1].As<Napi::String>().ToString();
    int result =
        setIpv6(info[0].As<Napi::Number>().Int32Value(), (char*)ip.data(),
                info[2].As<Napi::Number>().Int32Value());
    if (result == -1) {
        throwErrnoError(env, errno);
    }
    return Napi::Number::From(env, result);
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("tuntapInit", Napi::Function::New(env, tuntapInit));
    exports.Set("tuntapGetFlags", Napi::Function::New(env, tuntapGetFlags));
    exports.Set("tuntapSetMac", Napi::Function::New(env, tuntapSetMac));
    exports.Set("tuntapSetUp", Napi::Function::New(env, tuntapSetUp));
    exports.Set("tuntapSetDown", Napi::Function::New(env, tuntapSetDown));
    exports.Set("tuntapSetMtu", Napi::Function::New(env, tuntapSetMtu));
    exports.Set("tuntapGetMtu", Napi::Function::New(env, tuntapGetMtu));
    exports.Set("tuntapSetIpv4", Napi::Function::New(env, tuntapSetIpv4));
    exports.Set("tuntapGetIfIndex", Napi::Function::New(env, tuntapGetIfIndex));
    exports.Set("tuntapSetIpv6", Napi::Function::New(env, tuntapSetIpv6));
    return exports;
}

NODE_API_MODULE(tuntap2Addon, Init)
