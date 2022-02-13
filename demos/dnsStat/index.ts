const { Tun } = require('tuntap2');
const ip = require('ip-packet');
const udp = require('udp-packet');
const dns = require('dns-packet');
const jmespath = require('jmespath');
const timsort = require('timsort');
const dgram = require('dgram');
const {exec} = require('child_process');


interface ipStat {
    domains: Set<string>,
    count: number
}

const ipStatCompare = function (a: ipStat, b: ipStat) {
    return a.count - b.count;
}

const tun = new Tun();
const ipToDomains = {};
const topIps: Array<ipStat> = [];
tun.mtu = 1400;
tun.onReceive = (buf) => {
    try {
        const ipPacket = ip.decode(buf);
        if (ipPacket.protocol == 17) {
            const udpPacket = udp.decode(buf.data);
            if (udpPacket.destinationPort == 53) {
                const dnsPacket = dns.decode(udpPacket.data);
                const answersA = jmespath.search(dnsPacket, `answers[?type=='A'].{name:name,data:data}`);
                answersA.forEach(element => {
                    const domain = element.name;
                    const ip = element.data;
                    if (ip) {
                        if (ipToDomains[ip] === undefined) {
                            ipToDomains[ip] = {
                                domains: new Set(),
                                count: 0,
                            } as ipStat;
                            topIps.push(ipToDomains[ip]);
                        }
                        const stat = ipToDomains[ip] as ipStat;
                        stat.domains.add(domain);
                        stat.count++;
                        timsort(topIps, ipStatCompare);
                    }
                });
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}
tun.ipv4 = '1.2.3.4/24';
tun.isUp = true;
console.log("start running dnsStat");
//openwrt 21.04
exec(`iptables -A PREROUTING -p udp --sport 53 -j TEE --gateway 1.2.3.4`,()=>{});
const readline = require('readline')
const waitCommandLine = function () {
    const cliIf = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    cliIf.question(`input something:`, inputString => {
        console.log(JSON.stringify(topIps.slice(0, 9)));
        cliIf.close();
        waitCommandLine();
    })
}
waitCommandLine();