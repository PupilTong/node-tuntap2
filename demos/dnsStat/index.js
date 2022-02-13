var Tun = require('tuntap2').Tun;
var ip = require('ip-packet');
var udp = require('udp-packet');
var dns = require('dns-packet');
var jmespath = require('jmespath');
var timsort = require('timsort');
var dgram = require('dgram');
var exec = require('child_process').exec;
var ipStatCompare = function (a, b) {
    return a.count - b.count;
};
var tun = new Tun();
var ipToDomains = {};
var topIps = [];
tun.mtu = 1400;
tun.onReceive = function (buf) {
    try {
        var ipPacket = ip.decode(buf);
        console.log(ipPacket);
        if (ipPacket.protocol == 17) {
            var udpPacket = udp.decode(buf.data);
            if (udpPacket.destinationPort == 53) {
                var dnsPacket = dns.decode(udpPacket.data);
                var answersA = jmespath.search(dnsPacket, "answers[?type=='A'].{name:name,data:data}");
                answersA.forEach(function (element) {
                    var domain = element.name;
                    var ip = element.data;
                    if (ip) {
                        if (ipToDomains[ip] === undefined) {
                            ipToDomains[ip] = {
                                domains: new Set(),
                                count: 0
                            };
                            topIps.push(ipToDomains[ip]);
                        }
                        var stat = ipToDomains[ip];
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
};
tun.ipv4 = '1.2.3.4/24';
tun.isUp = true;
// const udp4 = dgram.createSocket('udp4');
// udp4.bind(43210);
// udp4.on('message', (msg, info) => {
//     udp4.send(JSON.stringify(topIps.slice(0, 9)), info.port, info.address,  () => { console.log('response error!') });
// })
console.log("start running dnsStat");
exec("iptables -A PREROUTING -p udp --sport 53 -j TEE --gateway 1.2.3.4", function () { });
var readline = require('readline');
var waitCommandLine = function () {
    var cliIf = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    cliIf.question("input something:", function (inputString) {
        console.log(JSON.stringify(topIps.slice(0, 9)));
        cliIf.close();
        waitCommandLine();
    });
};
waitCommandLine();
