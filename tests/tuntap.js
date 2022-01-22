const {Tap,Tun} = require('..');
const should = require("should");
const os = require('os');
describe("Test tun creating.", function () {
  it("should successfuly creating object", function (done) {
    const tun = new Tun();
    tun.release()
    done();
  });
  it("test create two devices", function (done) {
    const tun = new Tun();
    const tun2 = new Tun();
    tun.release();
    tun2.release()
    done();
  });
  it("test create two type devices", function (done) {
    const tun = new Tun();
    const tap = new Tap();
    tun.release()
    tap.release()
    done();
  });
  it("test type", function (done) {
    const tun = new Tun();
    const tap = new Tap();
    should.equal(tun.isTap,false,"tun.isTap should equal `false`");
    should.equal(tap.isTun,false,"tap.isTap should equal `false`");
    tun.release()
    tap.release()
    done();
  });
});
describe("set interface up",function(){
  let tun;
  beforeEach(function(){
    tun = new Tun();
  })
  it("should success",function(done) {
    tun.isUp = true;
    done();
  });
  it("should exist in system", function (done) {
    tun.isUp = true;
    should.exist(os.networkInterfaces()[`${tun.name}`],`cannot find ${tun.name}`, "deivce doesn't exist in os");
    done();
  });
  afterEach(function(){
    tun.release()
  })
});
describe("set interface down",function(){
  let tun;
  beforeEach(function(){
    tun = new Tun();
  })
  it("set down",function(done) {
    tun.isUp = false;
    done();
  });
  it("set up and down",function(done) {
    tun.isUp = true;
    tun.isUp = false;
    should.not.exist(os.networkInterfaces()[`${tun.name}`],`still existing: ${tun.name}`, `device should not exist in os`);
    done();
  })
  
  it("set up and down and up",function(done) {
    tun.isUp = true;
    tun.isUp = false;
    tun.isUp = true;
    should.exist(os.networkInterfaces()[`${tun.name}`],`cannot find ${tun.name}`, `device should exist in os again`);
    done();
  })
  afterEach(function(){
    tun.release()
  })
});
describe("mac address for tap",function(){
  let tap;
  before(function () {
    tap = new Tap();
  });
  it("set mac addr",function(done) {
    tap.mac ="00:cd:ef:12:34:56"; // L2 hardware address starting from byte 0.
    done();
  });
  it("get mac addr",function(done) {
    let mac;
    should.throws(()=>{mac = tap.mac},"should throw if dev doesn't up")
    tap.isUp = true;
    mac = tap.mac
    should.equal(mac,"00:cd:ef:12:34:56", `mac address ${mac}  doesn't equal to the address which we just set`);
    done();
  });
  after(function () {
    tap.release();
  });
});
describe("set ipv4 addresses",function(){
  let tun;
  before(function () {
    tun = new Tun();
    tun.isUp = true;
  });
  it("set ipv4",function(done) {
    tun.ipv4 = "1.2.3.4/8";
    should.equal(tun.ipv4,"1.2.3.4/8","ipv4 address doesn't equal to the address which we just set");
    done()
  });
  it("set incorrect ipv4",function(done) {
    should.throws(()=>{
      tun.ipv4 = "1.2.3.4/8/";
    },"should throw for incorrect ip");
    done()
  });
  after(function(){
    tun.release();
  })
});

describe("set mtu",function(){
  let tun;
  before(function () {
    tun = new Tun();
    tun.isUp = true;
  });
  it("set mtu",function(done) {
    tun.mtu = 1400;
    done();
  });
  it("get mtu",function(done) {
    should.equal(tun.mtu,1400,"mtu doesn't equal to the address which we just set");
    done();
  });
  after(function(){
    tun.release();
  })
});

describe("set ipv6",function(){
  let tun;
  before(function () {
    tun = new Tun();
    tun.isUp = true;
  });
  it("set ipv6",function(done) {
    tun.ipv6 = "abcd:1:2:3::/64";
    done();
  });
  it("get ipv6",function(done) {
    should.equal(tun.ipv6,"abcd:1:2:3::/64","ipv6 doesn't equal to the address which we just set");
    done();
  });
  it("set incorrect ipv6",function(done) {
    should.throws(()=>{
      tun.ipv6 = "1.2.3.4:1:2";
    },"should throw for incorrect ip");
    done()
  });
  after(function(){
    tun.release();
  })
});