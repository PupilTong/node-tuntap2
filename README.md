# node-tuntap2

a opensource, asynchronized, napi-based, business friendly tuntap device driver addon for nodejs.

[![](https://img.shields.io/npm/v/tuntap2.svg?style=flat)](https://www.npmjs.org/package/tuntap2)
[![Node.js CI](https://github.com/PupilTong/node-tuntap2/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/PupilTong/node-tuntap2/actions/workflows/node.js.yml)
[![Node.js Package](https://github.com/PupilTong/node-tuntap2/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/PupilTong/node-tuntap2/actions/workflows/npm-publish.yml)
![](https://img.shields.io/badge/Coverage-93%25-83A603.svg?prefix=$coverage$)

[![Package quality](https://packagequality.com/shield/tuntap2.svg)](https://packagequality.com/#?package=tuntap2)


## TL; DR

```javascript
const {Tun, Tap} = require('tuntap2');

try {
    const tun = new Tun();
    tun.mtu = 1400;
    tun.ipv4 = '10.0.0.100/24';
    tun.ipv6 = 'abcd:1:2:3::/64';
    tun.on('data', (buf) => {
        console.log('received:', buf);
    })
    tun.isUp = true;
    console.log(`created tun: ${tun.name}, ip: ${tun.ipv4}, ${tun.ipv6}, mtu: ${tun.mtu}`);
    tun.release();

}
catch(e) {
	console.log('error: ', e);
	process.exit(0);
}
```

## install

```bash
npm i tuntap2
```

## Properties

```typescript
interface TuntapI extends Duplex {
    /**
     * the name of this tun/tap device. 
     * This will be generated.
     * @type {string}
     * @memberof TuntapI
     * @since 0.0.1
     */
    readonly name: string;
    /**
     * returns `true` if this is a Tap device
     * @type {boolean}
     * @memberof TuntapI
     * @since 0.0.1
     */
    readonly isTap: boolean;
    /**
     * returns `true` if this is a Tun device
     * @type {boolean}
     * @memberof TuntapI
     * @since 0.0.1
     */
    readonly isTun: boolean;
    /**
     * the mac address of this interface
     * @example
     * ```js
     * this.mac = '00:11:22:33:44:55';
     * ```
     * @type {string}
     * @memberof TuntapI
     * @since 0.1.1
     */
    mac: string;
    /**
     * mtu of this interface
     * @example
     * ```js
     * this.mtu = 1500;
     * ```
     * @type {number}
     * @memberof TuntapI
     * @since 0.0.1
     */
    mtu: number;
    /**
     * ipv4 address/subnet in cidr format of this interface
     * @example
     * ```js
     * this.ipv4='127.0.0.1/24';
     * ```
     * @type {string}
     * @memberof TuntapI
     * @since 0.0.1
     */
    ipv4: string;
    /**
     * ipv6 address/subnet in cidr format of this interface
     * @example
     * ```js
     * this.ipv6='abcd:0:1::/64';
     * ```
     * @type {string}
     * @memberof TuntapI
     * @since 0.0.1
     */
    ipv6: string;
    /**
     * get/set the interface to up/down status
     * @example
     * ```js
     * this.isUp = true; //set this interface up
     * ```
     * @type {boolean}
     * @memberof TuntapI
     * @since 0.0.1
     */
    isUp: boolean;
    /**
     * release this interface
     * @memberof TuntapI
     */
    release: ()=>void;
}
```


**Note:** Reading properties requires your interface in `up` status.

**Note:** For a `Tun` device, `mac` property is readonly.

**Node:** Please make sure the first 8bits is `00` for setting the mac address of a Tap device.

## Streams API

The tuntap object supports Node.js `Duplex` interface. However, almost all streams api methods is a wrapper of fs.ReadStream or fs.WriteStream. The writing and events are based on them.

## Performance

The writing and reading of tuntap is based on nodejs `fs` and `readingStream`. This means these methods is running on libuv threads pool. Please set the threads pool size properly for your application.

## Test

```bash
npm test
```

## Contribute

Please feel free to create issues, Prs and tell me your ideas! 

**I REALLY APPRECIATE IT**

## TODO

* [ ] add BSD os support
* [ ] add tap devices support for osx, using utun.
* [ ] add demos
