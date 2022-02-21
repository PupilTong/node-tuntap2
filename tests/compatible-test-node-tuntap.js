const {tuntap} = require('..');
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
});