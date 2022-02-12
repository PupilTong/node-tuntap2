const {Tap,} = require('..');
const should = require("should");
const os = require('os');
describe("Test tap creating.", function () {
  it("should successfuly creating object", function (done) {
    const tap = new Tap();
    tap.release()
    done();
  });
});
describe("set interface up",function(){
  let tap;
  beforeEach(function(){
    tap = new Tap();
  })
  it("should success",function(done) {
    tap.isUp = true;
    done();
  });
  it("should exist in system", function (done) {
    tap.isUp = true;
    should.exist(os.networkInterfaces()[`${tap.name}`],`cannot find ${tap.name}`, "deivce doesn't exist in os");
    done();
  });
  afterEach(function(){
    tap.release()
  })
});
describe("set interface down",function(){
  let tap;
  beforeEach(function(){
    tap = new Tap();
  })
  it("set down",function(done) {
    tap.isUp = false;
    done();
  });
  it("set up and down",function(done) {
    tap.isUp = true;
    tap.isUp = false;
    should.not.exist(os.networkInterfaces()[`${tap.name}`],`still existing: ${tap.name}`, `device should not exist in os`);
    done();
  })
  
  it("set up and down and up",function(done) {
    tap.isUp = true;
    tap.isUp = false;
    tap.isUp = true;
    should.exist(os.networkInterfaces()[`${tap.name}`],`cannot find ${tap.name}`, `device should exist in os again`);
    done();
  })
  afterEach(function(){
    tap.release()
  })
});
describe("mac address for tap",function(){
  let tap;
  before(function () {
    tap = new Tap();
  });
  it("set mac addr",function(done) {
    tap.isUp = true;
    tap.mac ="00:cd:ef:12:34:56"; // L2 hardware address starting from byte 0.
    done();
  });
  it("get mac addr",function(done) {
    let mac;
    tap.isUp = false;
    should.throws(()=>{mac = tap.mac},"should throw if dev doesn't up")
    tap.isUp = true;
    mac = tap.mac
    should.equal(mac,"00:cd:ef:12:34:56", `mac address ${mac}  doesn't equal to the address which we just set 00:cd:ef:12:34:56`);
    done();
  });
  after(function () {
    tap.release();
  });
});
describe("set ipv4 addresses",function(){
  let tap;
  before(function () {
    tap = new Tap();
    tap.isUp = true;
  });
  it("set ipv4",function(done) {
    tap.ipv4 = "1.2.3.4/8";
    should.equal(tap.ipv4,"1.2.3.4/8","ipv4 address doesn't equal to the address which we just set");
    done()
  });
  it("set incorrect ipv4",function(done) {
    should.throws(()=>{
      tap.ipv4 = "1.2.3.4/8/";
    },"should throw for incorrect ip");
    done()
  });
  after(function(){
    tap.release();
  })
});

describe("set mtu",function(){
  let tap;
  before(function () {
    tap = new Tap();
    tap.isUp = true;
  });
  it("set mtu",function(done) {
    tap.mtu = 1400;
    done();
  });
  it("get mtu",function(done) {
    should.equal(tap.mtu,1400,"mtu doesn't equal to the address which we just set");
    done();
  });
  after(function(){
    tap.release();
  })
});

describe("set ipv6",function(){
  let tap;
  before(function () {
    tap = new Tap();
    tap.isUp = true;
  });
  it("set ipv6",function(done) {
    tap.ipv6 = "abcd:1:2:3::/64";
    done();
  });
  it("get ipv6",function(done) {
    should.equal(tap.ipv6,"abcd:1:2:3::/64","ipv6 doesn't equal to the address which we just set");
    done();
  });
  it("set incorrect ipv6",function(done) {
    should.throws(()=>{
      tap.ipv6 = "1.2.3.4:1:2";
    },"should throw for incorrect ip");
    done()
  });
  after(function(){
    tap.release();
  })
});