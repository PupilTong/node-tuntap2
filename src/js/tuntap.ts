import tuntapAddon from "./tuntap2Addon";
import * as fs from "fs";
import * as os from "os";
import * as jsonpath from "jsonpath";import { StreamOptions } from "stream";
interface Tuntap {
    readonly name: string;
    readonly isTap:boolean;
    readonly isTun:boolean;
    readonly writeStream:fs.WriteStream;
    readonly readStream:fs.ReadStream;
    mac: string;
    mtu: number;
    ipv4: string;
    ipv6: string;
    isUp : boolean;
    release: () => Promise<void>;
    writePacket:(data:Buffer,callback:(err:Error)=>void)=>Promise<void>;
}
class tuntap implements Tuntap {
    _deviceMode: string;
    _fd: number;
    _ifName: string;
    _isUp:boolean = false;
    _writingStream:fs.WriteStream;
    _readingStream:fs.ReadStream;


    constructor(mode: "tun" | "tap") {
        this._deviceMode = mode;
        this._fd = fs.openSync(`/dev/net/tun`, "r+");
        this._ifName = tuntapAddon.tuntapInit(this._fd, mode == "tap");
        this._writingStream = fs.createWriteStream('',{
            fd: this._fd,
            autoClose:false
        });
        this._readingStream = fs.createReadStream('',{
            fd:this._fd,
            autoClose:false
        });
        this._readingStream.setEncoding('binary');
        this._readingStream.on('data',(packet)=>{
        })
    }
    public async writePacket(packet:Buffer, callback:(err:Error)=>void) {
        this._writingStream.write(packet,callback);
    }
    get name(): string {
        return this._ifName;
    }
    get isTap(): boolean {
        return this._deviceMode == "tap";
    }
    get writeStream(): fs.WriteStream{
        return this._writingStream;
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
    private makeSureIsUp(){
        if(!this.isUp){
            throw `you must set isUp = true in order to access this method`;
        }
    };
    public async release():Promise<any> {
        await fs.close(this._fd);
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
