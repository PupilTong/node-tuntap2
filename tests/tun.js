const { Tap, Tun } = require("..");
const should = require("should");
const os = require("os");
const dgram = require("dgram");
const jmespath = require('jmespath');
const { type } = require("os");
describe("Test tun creating.", function () {
    it("should successfuly creating object", function (done) {
        const tun = new Tun();
        tun.release();
        done();
    });
    it("test create two devices", function (done) {
        const tun = new Tun();
        const tun2 = new Tun();
        tun.release();
        tun2.release();
        done();
    });
    it("test create two type devices", function (done) {
        const tun = new Tun();
        const tap = new Tap();
        tun.release();
        tap.release();
        done();
    });
    it("test type", function (done) {
        const tun = new Tun();
        const tap = new Tap();
        should.equal(tun.isTap, false, "tun.isTap should equal `false`");
        should.equal(tap.isTun, false, "tap.isTap should equal `false`");
        tun.release();
        tap.release();
        done();
    });
});
describe("set interface up", function () {
    let tun;
    beforeEach(function () {
        tun = new Tun();
    });
    it("should success", function (done) {
        tun.isUp = true;
        done();
    });
    it("should exist in system", function (done) {
        tun.isUp = true;
        should.exist(
            os.networkInterfaces()[`${tun.name}`],
            `cannot find ${tun.name}`,
            "deivce doesn't exist in os",
        );
        done();
    });
    afterEach(function () {
        tun.release();
    });
});
describe("set interface down", function () {
    let tun;
    beforeEach(function () {
        tun = new Tun();
    });
    it("set down", function (done) {
        tun.isUp = false;
        done();
    });
    it("set up and down", function (done) {
        tun.isUp = true;
        tun.isUp = false;
        should.not.exist(
            os.networkInterfaces()[`${tun.name}`],
            `still existing: ${tun.name}`,
            `device should not exist in os`,
        );
        done();
    });

    it("set up and down and up", function (done) {
        tun.isUp = true;
        tun.isUp = false;
        tun.isUp = true;
        should.exist(
            os.networkInterfaces()[`${tun.name}`],
            `cannot find ${tun.name}`,
            `device should exist in os again`,
        );
        done();
    });
    afterEach(function () {
        tun.release();
    });
});
describe("set ipv4 addresses", function () {
    let tun;
    before(function () {
        tun = new Tun();
        tun.isUp = true;
    });
    it("set ipv4", function (done) {
        tun.ipv4 = "1.2.3.4/8";
        should.equal(
            tun.ipv4,
            "1.2.3.4/8",
            "ipv4 address doesn't equal to the address which we just set",
        );
        done();
    });
    it("set incorrect ipv4", function (done) {
        should.throws(() => {
            tun.ipv4 = "1.2.3.4/8/";
        }, "should throw for incorrect ip");
        done();
    });
    after(function () {
        tun.release();
    });
});

describe("set mtu", function () {
    let tun;
    before(function () {
        tun = new Tun();
        tun.isUp = true;
    });
    it("set mtu", function (done) {
        tun.mtu = 1400;
        done();
    });
    it("get mtu", function (done) {
        should.equal(
            tun.mtu,
            1400,
            "mtu doesn't equal to the address which we just set",
        );
        done();
    });
    after(function () {
        tun.release();
    });
});

describe("set ipv6", function () {
    let tun;
    before(function () {
        tun = new Tun();
        tun.isUp = true;
    });
    it("set ipv6", function (done) {
        tun.ipv6 = "abcd:1:2:3::/64";
        done();
    });
    it("get ipv6", function (done) {
        should.equal(
            tun.ipv6,
            "abcd:1:2:3::/64",
            "ipv6 doesn't equal to the address which we just set",
        );
        done();
    });
    it("set incorrect ipv6", function (done) {
        should.throws(() => {
            tun.ipv6 = "1.2.3.4:1:2";
        }, "should throw for incorrect ip");
        done();
    });
    after(function () {
        tun.release();
    });
});

describe("test send and receive packet", function () {
    let tun;
    let packet;
    let socket;
    // this.timeout(200000);
    before(function () {
        tun = new Tun();
        tun.isUp = true;
        tun.ipv4 = "4.3.2.0/24";
        packet = Buffer.from([
            0x45, 0x02, 0x00, 0x54, 0x6e, 0x97, 0x00, 0x00, 0x40, 0x01, 0xf7,
            0xf2, 0x0a, 0x01, 0x00, 0x13, 0x0a, 0x00, 0x00, 0x0a, 0x08, 0x00,
            0xd3, 0xf9, 0x00, 0x05, 0x00, 0x02, 0x84, 0x9e, 0xc8, 0x61, 0x00,
            0x00, 0x00, 0x00, 0x13, 0x2c, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a,
            0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25,
            0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f, 0x30,
            0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,
        ]);
        socket = dgram.createSocket("udp4");
    });
    it("send one packet", function (done) {
        tun.writePacket(packet, () => {});
        done();
    });
    it("receive packet", function (done) {
        tun.writePacket(packet, () => {});
        tun.onReceive = (chunk) => {
            // console.log(`${tun.name} - Receiver: ${chunk.length} bytes`);
            tun.onReceive = ()=>{};
            done();
        }
        socket.send("hello!", 43210, '4.3.2.1', (err) => {});
    })
    ;
    after(function () {
        tun.release();
        socket.close();
    });
});

describe("test send by tun and receive by another tun", function () {
    let tun1;
    let tun2;
    let packet;
    this.timeout(2000);
    before(function () {
        tun1 = new Tun();
        tun1.isUp = true;
        tun1.ipv4 = "4.3.2.2/24\\";
        tun2 = new Tun();
        tun2.isUp = true;
        tun2.ipv4 = "1.2.3.0/24";
        // packet = Buffer.from([
        //     0x45, 0x02, 0x00, 0x21, 0x6e, 0x97, 0x00, 0x00, 0x40, 0x11, 0x87, 0x2e, 0x04, 0x03, 0x02, 0x01,
        //     0x7f, 0x00, 0x00, 0x01, 0xe0, 0xb4, 0xa8, 0xca, 0x00, 0x0d, 0xfe, 0x20, 0x68, 0x65, 0x6c, 0x6c,
        //     0x6f
        // ]);
        packet = Buffer.from([
            0x45, 0x00, 0x00, 0x22, 0xd5, 0xd1, 0x40, 0x00, 0x40, 0x11, 0x56,
            0xe0, 0x0a, 0x01, 0x00, 0x13, 0x01, 0x02, 0x03, 0x04, 0x98, 0x5d,
            0xa8, 0xca, 0x00, 0x0e, 0x0e, 0x39, 0x68, 0x65, 0x6c, 0x6c, 0x6f,
            0x21
        ]);
    });
    it("test message 'hello!' ", function (done) {
        /*
            must enable ipv4 forwarding in os
            1. iptables -L  or iptables -P FORWARD ACCEPT
            2. sysctl net.ipv4.ip_forward=1
        */
        tun2.onReceive = (buf)=>{
            const isEqual = buf.reduce((perv, curr, index)=>{
                if(index>=packet.length)return false;
                // console.log(`${curr},${packet[index]},index: ${index}`);
                return (perv==1) && ((curr == packet[index]) 
                    || index === 8 //skip TTL
                    || index === 10 || index === 11 //skip checksum
                );
            },1);
            if(isEqual)done();
        };
        tun1.writePacket(packet,()=>{});
    });
    after(function () {
        tun1.release();
        tun2.release();
    });
});
