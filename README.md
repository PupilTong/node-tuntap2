# node-tuntap2

a opensource, asynchronized, napi-based, business friendly tuntap device driver addon for nodejs.

[![Node.js CI](https://github.com/PupilTong/node-tuntap2/actions/workflows/node.js.yml/badge.svg)](https://github.com/PupilTong/node-tuntap2/actions/workflows/node.js.yml)

[![Node.js Package](https://github.com/PupilTong/node-tuntap2/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/PupilTong/node-tuntap2/actions/workflows/npm-publish.yml)

## TL; DR

```javascript
const {Tun, Tap} = require('tuntap2');

try {
    const tun = new Tun();
    tun.mtu = 1400;
    tun.ipv4 = '10.0.0.100/24';
    tun.ipv6 = 'abcd:1:2:3::/64';
    tun.onReceive = (buf) => {
        console.log('received:', buf);
    }
    tun.isUp = true;
    console.log(`created tun: ${tun.name}, ip: ${tun.ipv4}, ${tun.ipv6}, mtu: ${tun.mtu}`);
    tun.release();

}
catch(e) {
	console.log('error: ', e);
	process.exit(0);
}
```

## Properties

```typescript
    interface Tuntap {
        readonly name: string;
        readonly isTap: boolean;
        readonly isTun: boolean;
        mac: string;
        mtu: number;
        ipv4: string;
        ipv6: string;
        isUp: boolean;
        onReceive: (packet: Buffer) => void;
        release: () => Promise<void>;
        writePacket: (
            data: Buffer,
            callback: (
                err: NodeJS.ErrnoException,
                written: number,
                buffer: Buffer,
            ) => void,
        ) => void;
    }
```

**Note:** Reading properties requires your interface in `up` status.

**Note:** For a `Tun` device, `mac` property is readonly.

**Node:** Please make sure the first 8bits is `00` for setting the mac address of a Tap device.

## Performace

The writing and reading of tuntap is based on nodejs `fs` and `readingStream`. This means these methods is running on libuv threads pool. Please set the threads pool size properly for your application.

## Contribute

Please feel free to create issues, Prs and tell me your ideas! 

**I REALLY APPRECIATE IT**

## TODO

* [ ] make it compatible with `node-tuntap`
* [ ] make it compatible with `pipe()`
* [ ] add BSD os support
* [ ] add tap devices support for osx, using utun.
* [ ] add demos
