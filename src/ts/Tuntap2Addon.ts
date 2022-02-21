export interface tuntap2AddonTypes {
    tuntapInit: (fd: number, isTap: boolean) => string;
    tuntapGetFlags: (name: string) => number;
    tuntapSetMac: (name: string, mac: string) => number;
    tuntapSetUp: (name: string) => number;
    tuntapSetDown: (name: string) => number;
    tuntapSetMtu: (name: string, mtu: number) => number;
    tuntapGetMtu: (name: string) => number;
    tuntapSetIpv4: (name: string, ipStr: string, netmask: number) => number;
    tuntapGetIfIndex: (name: string) => number;
    tuntapSetIpv6: (ifIndex: number, ipStr: string, prefix: number) => number;
}
const tuntap2Addon: tuntap2AddonTypes = require("../../../build/Release/tuntap2Addon");
export default tuntap2Addon;
