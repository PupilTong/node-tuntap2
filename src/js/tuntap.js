"use strict";
const tuntap2Addon_1 = require("./tuntap2Addon");
const fs = require("fs");
const os = require("os");
const jmespath = require("jmespath");
class Tuntap {
    constructor(mode) {
        this._isUp = false;
        this._deviceMode = mode;
        this._fd = fs.openSync(`/dev/net/tun`, 'r+', fs.constants.O_SYNC);
        this._ifName = tuntap2Addon_1.default.tuntapInit(this._fd, mode == 'tap');
        this.readable = fs.createReadStream('', {
            fd: this._fd,
            autoClose: false,
            emitClose: true,
        });
        this.writable = fs.createWriteStream('', {
            fd: this._fd,
            autoClose: false,
            emitClose: false,
            fs: {
                write: fs.write,
                open: () => { }
            }
        });
    }
    ;
    release(error) {
        this.readable.destroy(error);
    }
    ;
    pipe(destination, options) {
        this.readable.pipe(destination, options);
        return this.writable;
    }
    makeSureIsUp() {
        if (!this.isUp) {
            throw `you must set isUp = true in order to access this method`;
        }
    }
    get name() {
        return this._ifName;
    }
    get isTap() {
        return this._deviceMode == 'tap';
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
        const mac = jmespath.search(ifInfo, `${this._ifName}[*].[mac]|[0]`);
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
        return jmespath.search(ifInfo, `${this._ifName}[?family=='IPv4'].cidr|[0]`);
    }
    set ipv4(ip) {
        const cirdArray = ip.split('/');
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
        return jmespath.search(ifInfo, `${this._ifName}[?family=='IPv6'].cidr|[0]`);
    }
    set ipv6(ip) {
        const cirdArray = ip.split('/');
        if (cirdArray.length != 2) {
            throw `incorrect ipv6 address: ${ip}`;
        }
        const addr = cirdArray[0];
        const prefix = Number.parseInt(cirdArray[1]);
        const ifIndex = tuntap2Addon_1.default.tuntapGetIfIndex(this._ifName);
        tuntap2Addon_1.default.tuntapSetIpv6(ifIndex, addr, prefix);
    }
}
class Tap extends Tuntap {
    constructor() {
        super('tap');
    }
    set mac(mac) {
        tuntap2Addon_1.default.tuntapSetMac(this._ifName, mac);
    }
    get mac() {
        return super.mac;
    }
}
class Tun extends Tuntap {
    constructor() {
        super('tun');
    }
}
module.exports = { Tap, Tun };
//# sourceMappingURL=tuntap.js.map