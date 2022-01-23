"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const tuntap2Addon_1 = require("./tuntap2Addon");
const fs = require("fs");
const os = require("os");
const jsonpath = require("jsonpath");
class tuntap {
    constructor(mode) {
        this._isUp = false;
        this._deviceMode = mode;
        this._fd = fs.openSync(`/dev/net/tun`, "r+");
        this._ifName = tuntap2Addon_1.default.tuntapInit(this._fd, mode == "tap");
        this._writingStream = fs.createWriteStream('', {
            fd: this._fd,
            autoClose: false,
            emitClose: false
        });
        this._readingStream = fs.createReadStream('', {
            fd: this._fd,
            autoClose: false,
            emitClose: false
        });
        this._readingStream.setEncoding('binary');
    }
    writePacket(packet, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this._writingStream.write(packet, callback);
        });
    }
    get name() {
        return this._ifName;
    }
    get isTap() {
        return this._deviceMode == "tap";
    }
    get writeStream() {
        return this._writingStream;
    }
    get readStream() {
        return this._readingStream;
    }
    get isTun() {
        return !this.isTap;
    }
    get isUp() {
        return this._isUp;
    }
    set isUp(activate) {
        if (activate) {
            tuntap2Addon_1.default.tuntapSetUp(this._ifName);
        }
        else {
            tuntap2Addon_1.default.tuntapSetDown(this._ifName);
        }
        this._isUp = activate;
    }
    get mac() {
        this.makeSureIsUp();
        const ifInfo = os.networkInterfaces();
        const mac = jsonpath.query(ifInfo, `$.${this._ifName}[?(@.mac)].mac`)[0];
        return mac;
    }
    get mtu() {
        return tuntap2Addon_1.default.tuntapGetMtu(this._ifName);
    }
    set mtu(mtu) {
        tuntap2Addon_1.default.tuntapSetMtu(this._ifName, mtu);
    }
    get ipv4() {
        this.makeSureIsUp();
        const ifInfo = os.networkInterfaces();
        return jsonpath.query(ifInfo, `$.${this._ifName}[?(@.family=='IPv4')].cidr`)[0];
    }
    set ipv4(ip) {
        const cirdArray = ip.split("/");
        if (cirdArray.length != 2) {
            throw `incorrect ip address: ${ip}`;
        }
        const ipv4Addr = cirdArray[0];
        const ipv4NetMask = Number.parseInt(cirdArray[1]);
        tuntap2Addon_1.default.tuntapSetIpv4(this._ifName, ipv4Addr, ipv4NetMask);
    }
    get ipv6() {
        this.makeSureIsUp();
        const ifInfo = os.networkInterfaces();
        return jsonpath.query(ifInfo, `$.${this._ifName}[?(@.family=='IPv6')].cidr`)[0];
    }
    set ipv6(ip) {
        const cirdArray = ip.split("/");
        if (cirdArray.length != 2) {
            throw `incorrect ipv6 address: ${ip}`;
        }
        const addr = cirdArray[0];
        const prefix = Number.parseInt(cirdArray[1]);
        const ifIndex = tuntap2Addon_1.default.tuntapGetIfIndex(this._ifName);
        tuntap2Addon_1.default.tuntapSetIpv6(ifIndex, addr, prefix);
    }
    makeSureIsUp() {
        if (!this.isUp) {
            throw `you must set isUp = true in order to access this method`;
        }
    }
    ;
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            this._readingStream.destroy();
        });
    }
    ;
}
class Tap extends tuntap {
    constructor() {
        super("tap");
    }
    set mac(mac) {
        tuntap2Addon_1.default.tuntapSetMac(this._ifName, mac);
    }
    get mac() {
        return super.mac;
    }
}
class Tun extends tuntap {
    constructor() {
        super("tun");
    }
}
module.exports = { Tap, Tun };
//# sourceMappingURL=tuntap.js.map