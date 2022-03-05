
import {Tuntap} from './src/ts/Tuntap'
// this file only contains wrapper class for tuntap class.
/**
 * Tun interface, a Layer 2 virtual interface.
 * @class Tun
 * @extends {TuntapB}
 */
 class Tun extends Tuntap {
    constructor() {
        super('tun');
    }
    /**
     * setting the mac of a Tun interface is illegal as tun devices is running on layer 3
     * @throws 'method not support by a tun device.'
     * @memberof Tun
     * @since 0.1.0
     */
    set mac(mac:string){
        throw new Error('method not support by a tun device.');
    }
}

/**
 * Tap interface, a Layer 2 virtual interface.
 * The tap device allows 
 * @class Tap
 * @extends {TuntapB}
 */
 class Tap extends Tuntap {
    constructor() {
        super('tap');
    }
}

/**
 * a compatibility Wrapper for module `node-tuntap`
 *
 * @example
 * ```js
 *  try {
        var tt = tuntap({
            type: 'tun', // 'tun' or 'tap'
            mtu: 1500,
            addr: '192.168.123.1',
            mask: '255.255.255.192',
            up: true,
            //name is unacceptable
            //dest,persist,ethtype_comp,running is not used
        });
    } catch(e) {
        console.log('Tuntap creation error: ', e);
        process.exit(0);
    }
    tt.pipe(tt);
 * ```
 */
const tuntap = function(options: any){
    if(options.name){
        throw `setting a name of a tuntap device is not supported`
    }
    if(options.type!='tun' && options.type != 'tap'){
        throw `illegal type ${options.type}`
    }
    const device = new Tuntap(options.type);
    if(options.mtu){
        device.mtu = options.mtu;
    }
    let mask = 32;
    if(options.mask){
        const maskSplited = options.mask.split('.');
        if(maskSplited.length!=4){
            throw `illegal net mask!`
        }
        mask = 0;
        maskSplited.forEach(((segment: string) => {
            let numberSegment = parseInt(segment) & 0xff;
            let hasOne = false;
            for(let i=0;i<8;i++){
                if(numberSegment&0x01){
                    hasOne = true;
                    mask++;
                }
                else{
                    if(hasOne==true){
                        throw `illegal netmask`;
                    }
                }
                numberSegment = numberSegment>>1;
            }
        }));
    } 
    if(options.addr){
        let addr = [options.addr, mask].join('/');
        device.ipv4 = addr;
    }

    if(options.up){
        device.isUp = true;
    }
    return device;
}
export {Tap, Tun, tuntap};