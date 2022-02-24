const {tuntap} = require('..');
const should = require("should");
describe("Test Compatibility with node-tuntap.", function () {
    it("should not throw any error", function (done) {
        var tt = tuntap({
            type: 'tun',
            name: '',
            mtu: 1500,
            addr: '192.168.123.1',
            dest: '192.168.123.2',
            mask: '255.255.255.192',
            ethtype_comp: 'half',
            persist: false,
            up: true,
            running: true,
        });
        
        tt.pipe(tt);
        tt.release();
        done();
    });
    it("should not throw any error for miniumn options", function (done) {
        var tt = tuntap({
            type: 'tun',
            name: '',
        });
        tt.release();
        done();
    });
    
    it("should throw for setting name", function (done) {
        should.throws(()=>{
            var tt = tuntap({
                type: 'tun',
                name: 'tun',
                mtu: 1500,
                addr: '192.168.123.1',
                dest: '192.168.123.2',
                mask: '255.255.255.192',
                ethtype_comp: 'half',
                persist: false,
                up: true,
                running: true,
            });
        })
        done();
    });
    
    it("should throw for illegal device type", function (done) {
        should.throws(()=>{
            var tt = tuntap({
                type: 'tun1',
                name: '',
                mtu: 1500,
                addr: '192.168.123.1',
                dest: '192.168.123.2',
                mask: '255.255.255.192',
                ethtype_comp: 'half',
                persist: false,
                up: true,
                running: true,
            });
        })
        done();
    });
    
    it("should throw for illegal netmask", function (done) {
        should.throws(()=>{
            var tt = tuntap({
                type: 'tun',
                name: '',
                mtu: 1500,
                addr: '192.168.123.1',
                dest: '192.168.123.2',
                mask: '255.255.255.192.4',
                ethtype_comp: 'half',
                persist: false,
                up: true,
                running: true,
            });
        })
        should.throws(()=>{
            var tt = tuntap({
                type: 'tun',
                name: '',
                mtu: 1500,
                addr: '192.168.123.1',
                dest: '192.168.123.2',
                mask: '255.255.255.193',
                ethtype_comp: 'half',
                persist: false,
                up: true,
                running: true,
            });
        })
        done();
    });
    it("the deive setting should equals arguments", function (done) {
        const tt = tuntap({
            type: 'tun',
            name: '',
            mtu: 1500,
            addr: '192.168.123.1',
            dest: '192.168.123.2',
            mask: '255.255.255.192',
            ethtype_comp: 'half',
            persist: false,
            up: true,
            running: true,
        });
        should.equal(tt.mtu,1500,`device mtu isn't match!`);
        should.equal(tt.ipv4,'192.168.123.1/26',`device mtu isn't match!`);
        tt.release();
        done();
    });
});