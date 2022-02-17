import tuntapAddon from './tuntap2Addon';
import * as fs from 'fs';
import * as os from 'os';
import * as jmespath from 'jmespath';
import { Readable, Writable } from 'stream';
// interface TuntapI {
//     readonly name: string;
//     readonly isTap: boolean;
//     readonly isTun: boolean;
//     readonly readable: Readable;
//     readonly writable: Writable;
//     mac: string;
//     mtu: number;
//     ipv4: string;
//     ipv6: string;
//     isUp: boolean;
//     release: ()=>void;
// }
class Tuntap {
    _deviceMode: string;
    _fd: number;
    _ifName: string;
    _isUp: boolean = false;
    readonly readable: Readable;
    readonly writable: Writable;

    constructor(mode: 'tun' | 'tap') {
        this._deviceMode = mode;
        this._fd = fs.openSync(`/dev/net/tun`, 'r+', fs.constants.O_SYNC);
        this._ifName = tuntapAddon.tuntapInit(this._fd, mode == 'tap');
        this.readable = fs.createReadStream('', {
            fd: this._fd,
            autoClose: false,
            emitClose: true,
        });
        this.writable = fs.createWriteStream('',{
            fd: this._fd,
            autoClose: false,
            emitClose: false,
            fs:{
                write:fs.write
            }
        } as any);
    };
    release(error?: Error) {
        this.readable.destroy(error);
    };
    public pipe(destination: NodeJS.WritableStream, options?: { end?: boolean; }): NodeJS.WritableStream {
        this.readable.pipe(destination,options);
        return this.writable;
    }
    private makeSureIsUp() {
        if (!this.isUp) {
            throw `you must set isUp = true in order to access this method`;
        }
    }
    get name(): string {
        return this._ifName;
    }
    get isTap(): boolean {
        return this._deviceMode == 'tap';
    }
    get isTun(): boolean {
        return !this.isTap;
    }
    get isUp(): boolean {
        return this._isUp;
    }
    set isUp(activate: boolean) {
        if (activate) {
            tuntapAddon.tuntapSetUp(this._ifName);
        } else {
            tuntapAddon.tuntapSetDown(this._ifName);
        }
        this._isUp = activate;
    }
    get mac(): string {
        this.makeSureIsUp();
        const ifInfo = os.networkInterfaces();
        const mac: string = jmespath.search(
            ifInfo,
            `${this._ifName}[*].[mac]|[0]`,
        );
        return mac;
    }
    get mtu(): number {
        return tuntapAddon.tuntapGetMtu(this._ifName);
    }
    set mtu(mtu: number) {
        tuntapAddon.tuntapSetMtu(this._ifName, mtu);
    }
    get ipv4(): string {
        this.makeSureIsUp();
        const ifInfo = os.networkInterfaces();
        return jmespath.search(
            ifInfo,
            `${this._ifName}[?family=='IPv4'].cidr|[0]`,
        );
    }
    set ipv4(ip: string) {
        const cirdArray = ip.split('/');
        if (cirdArray.length != 2) {
            throw `incorrect ip address: ${ip}`;
        }
        const ipv4Addr = cirdArray[0];
        const ipv4NetMask = Number.parseInt(cirdArray[1]);
        tuntapAddon.tuntapSetIpv4(this._ifName, ipv4Addr, ipv4NetMask);
    }
    get ipv6() {
        this.makeSureIsUp();
        const ifInfo = os.networkInterfaces();
        return jmespath.search(
            ifInfo,
            `${this._ifName}[?family=='IPv6'].cidr|[0]`,
        );
    }
    set ipv6(ip: string) {
        const cirdArray = ip.split('/');
        if (cirdArray.length != 2) {
            throw `incorrect ipv6 address: ${ip}`;
        }
        const addr = cirdArray[0];
        const prefix = Number.parseInt(cirdArray[1]);
        const ifIndex = tuntapAddon.tuntapGetIfIndex(this._ifName);
        tuntapAddon.tuntapSetIpv6(ifIndex, addr, prefix);
    }
}
class Tap extends Tuntap {
    constructor() {
        super('tap');
    }
    set mac(mac: string) {
        tuntapAddon.tuntapSetMac(this._ifName, mac);
    }
    get mac(): string {
        return super.mac;
    }
}
class Tun extends Tuntap {
    constructor() {
        super('tun');
    }
}
export = { Tap, Tun };
