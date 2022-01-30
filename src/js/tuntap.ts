import tuntapAddon from "./tuntap2Addon";
import * as fs from "fs";
import * as os from "os";
import * as jsonpath from "jsonpath";import { StreamOptions } from "stream";
import { buffer } from "stream/consumers";
interface Tuntap {
    readonly name: string;
    readonly isTap:boolean;
    readonly isTun:boolean;
    mac: string;
    mtu: number;
    ipv4: string;
    ipv6: string;
    isUp : boolean;
    onReceive:(packet: Buffer)=>void;
    release: () => Promise<void>;
    writePacket:(data:Buffer,callback:()=>void)=>Promise<void>;
}
class tuntap implements Tuntap {
    _deviceMode: string;
    _fd: number;
    _ifName: string;
    _isUp:boolean = false;
    _readingStream:fs.ReadStream;
    _onReceive:(packet: Buffer)=>void;


    constructor(mode: "tun" | "tap") {
        this._deviceMode = mode;
        this._fd = fs.openSync(`/dev/net/tun`, "r+");
        this._ifName = tuntapAddon.tuntapInit(this._fd, mode == "tap");
        this._readingStream = fs.createReadStream('',{
            fd:this._fd,
            autoClose:false,
            emitClose:true
        });
        this._readingStream.setEncoding('binary');
    }
    public async writePacket(packet:Buffer, callback:()=>void) {
        fs.writeSync(this._fd,packet);
        callback();
    }
    private makeSureIsUp(){
        if(!this.isUp){
            throw `you must set isUp = true in order to access this method`;
        }
    };
    get onReceive(): (packet: Buffer)=>void {
        return this._onReceive;
    }
    set onReceive(newVal) {
        this._onReceive = newVal;
        this._readingStream.removeAllListeners('data');
        this._readingStream.on('data',this.onReceive);
    }
    get name(): string {
        return this._ifName;
    }
    get isTap(): boolean {
        return this._deviceMode == "tap";
    }
    get readStream(): fs.ReadStream{
        return this._readingStream;
    }
    get isTun():boolean{
        return !this.isTap;
    }
    get isUp():boolean{
        return this._isUp;
    }
    set isUp(activate:boolean){
        if(activate){
            tuntapAddon.tuntapSetUp(this._ifName);
        } else {
            tuntapAddon.tuntapSetDown(this._ifName);
        }
        this._isUp = activate;
    }
    get mac(): string {
        this.makeSureIsUp();
        const ifInfo = os.networkInterfaces();
        const mac: string = jsonpath.query(
            ifInfo,
            `$.${this._ifName}[?(@.mac)].mac`,
        )[0];
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
        
        return jsonpath.query(
            ifInfo,
            `$.${this._ifName}[?(@.family=='IPv4')].cidr`,
        )[0];
    }
    set ipv4(ip: string) {
        const cirdArray = ip.split("/");
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
        return jsonpath.query(
            ifInfo,
            `$.${this._ifName}[?(@.family=='IPv6')].cidr`,
        )[0];
    }
    set ipv6(ip: string) {
        const cirdArray = ip.split("/");
        if (cirdArray.length != 2) {
            throw `incorrect ipv6 address: ${ip}`;
        }
        const addr = cirdArray[0];
        const prefix = Number.parseInt(cirdArray[1]);
        const ifIndex = tuntapAddon.tuntapGetIfIndex(this._ifName);
        tuntapAddon.tuntapSetIpv6(ifIndex, addr, prefix);
    }
    public async release():Promise<any> {
        this._readingStream.destroy();
    };
}
class Tap extends tuntap {
    constructor(){
        super("tap");
    }
    set mac(mac: string) {
        tuntapAddon.tuntapSetMac(this._ifName, mac);
    }
    get mac():string{
        return super.mac;
    }
}
class Tun extends tuntap {
    constructor(){
        super("tun");
    }
}
export = { Tap, Tun };
