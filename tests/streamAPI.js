const {tun, Tun, tuntap} = require('..');
const should = require("should");
describe("Test should not cause crash on accessing all Streams API related members", function () {
    let tun;
    beforeEach(()=>{
        tun = new Tun();
        tun.isUp = true;
    })
    it("read properties for writeStream", function (done) {
        should.notEqual(tun.writableHighWaterMark,undefined);
        should.notEqual(tun.writableLength,undefined);
        should.notEqual(tun.writableObjectMode,undefined);
        should.notEqual(tun.writableCorked,undefined);
        should.notEqual(tun.allowHalfOpen,undefined);
        should.notEqual(tun.writable,undefined);
        should.notEqual(tun.writableEnded,undefined);
        should.notEqual(tun.writableFinished,undefined);
        done();
    });
    it("setDefaultEncoding", function (done) {
        should.throws(()=>{tun.setDefaultEncoding('binary')});
        should.throws(()=>{tun.setEncoding('binary')});
        done();
    });
    it("end", function (done) {
        const tunTemp = new Tun();
        tunTemp.end();
        tunTemp.once('close',()=>{
            done();
        })
    });
    it("cork and uncork", function (done) {
        tun.cork();
        tun.uncork();
        done();
    });
    it("read properties for readStream", function (done) {
        should.notEqual(tun.readableAborted,undefined);
        should.notEqual(tun.readable,undefined);
        should.notEqual(tun.readableDidRead,undefined);
        should.equal(tun.readableEncoding,null);
        should.notEqual(tun.readableEnded, undefined);
        should.notEqual(tun.readableFlowing + '','undefined');
        should.notEqual(tun.readableHighWaterMark,undefined);
        should.notEqual(tun.readableLength,undefined);
        should.notEqual(tun.readableObjectMode,undefined);
        should.notEqual(tun.destroyed,undefined);
        done();
    });
    it("pause and resume", function (done) {
        tun.pause()
        should.equal(tun.isPaused(),true);
        tun.resume()
        should.equal(tun.isPaused(),false);
        done();
    });    
    it("pipe and unpipe", function (done) {
        tun.pipe(tun);
        tun.unpipe(tun);
        done();
    });
    it("unshift and push", function (done) {
        const buf = Buffer.from([1,2,3,4,5]);
        tun.unshift(buf);
        tun.push(buf);
        done();
    });
    
    it("events", function (done) {
        let count = 0;
        tun.addListener('ready',()=>{count++});
        tun.on('ready',()=>{count++});
        tun.once('ready',()=>{count++});
        tun.prependListener('ready', ()=>{count++});
        tun.prependOnceListener('ready', ()=>{count++});
        tun.emit('ready');
        const toBeRemoved = function(){

        }
        tun.removeAllListeners('ready',toBeRemoved);
        tun.removeListener('ready',toBeRemoved);
        tun.off('ready',toBeRemoved);
        tun.setMaxListeners(16);
        tun.listeners('ready');
        tun.rawListeners('ready');
        tun.listenerCount('ready');
        tun.eventNames('ready');
        should.equal(tun.getMaxListeners('ready'),16);
        should.equal(count,5);
        done();
    });
    
    it("not yet implemented methods", function (done) {
        should.throws(()=>{tun._writev()});
        done();
    });

    afterEach(()=>{
        tun.release()
    })
});