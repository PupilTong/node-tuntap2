import {TuntapBase} from './TuntapBase'
import { TuntapI } from './tuntapI';

export class Tuntap extends TuntapBase implements TuntapI{
    get writableHighWaterMark(): number{
        return this.writeStream.writableHighWaterMark;
    };
    get writableLength(): number{
        return this.writeStream.writableLength;
    };
    get writableObjectMode(): boolean{
        return this.writeStream.writableObjectMode
    };
    get writableCorked(): number{
        return this.writeStream.writableCorked
    };
    get allowHalfOpen(): boolean{
        return false;
    };
    _write = this.writeStream._write;
    _writev?(chunks: { chunk: any; encoding: BufferEncoding; }[], callback: (error?: Error) => void): void {
        throw new Error('Method not implemented.');
    }
    _destroy(error: Error, callback: (error: Error) => void): void {
        this.writeStream._destroy(error, callback);
        this.readStream._destroy(error, callback);
        this.release();
    }
    _final(callback: (error?: Error) => void): void {
        this.writeStream._final(callback);
    }
    write = this.writeStream.write;
    setDefaultEncoding(encoding: BufferEncoding): this {
        throw new Error('Method is not allowed.');
    }
    // end(cb?: () => void): this;
    // end(chunk: any, cb?: () => void): this;
    // end(chunk: any, encoding?: BufferEncoding, cb?: () => void): this;
    end(chunk?: any, encoding?: any, cb?: any): this {
        throw new Error('Method not implemented.');
    }
    cork = this.writeStream.cork;
    uncork = this.writeStream.uncork;
    get readableAborted(): boolean{
        return this.readStream.readableAborted;
    };
    get readable(): boolean{
        return this.readStream.readable;
    }
    get readableDidRead(): boolean{
        return this.readStream.readableDidRead;
    }
    get readableEncoding(): BufferEncoding{
        return this.readStream.readableEncoding;
    }
    get readableEnded(): boolean{
        return this.readStream.readableEnded;
    }
    get readableFlowing(): boolean{
        return this.readStream.readableFlowing;
    }
    get readableHighWaterMark(): number{
        return this.readStream.readableHighWaterMark;
    }
    get readableLength(): number{
        return this.readStream.readableLength;
    }
    get readableObjectMode(): boolean{
        return this.readStream.readableObjectMode;
    }
    get destroyed(): boolean{
        return this.readStream.destroyed;
    }
    get_construct?(callback: (error?: Error) => void): void {
        return this.readStream._construct(callback);
    }
    _read = this.readStream._read;

    read = this.readStream.read;
    setEncoding(encoding: BufferEncoding): this {
        throw new Error('Method is not allowed.');
    }
    pause(): this {
        this.readStream.pause();
        return this;
    }
    resume(): this {
        this.readStream.resume();
        return this;
    }
    isPaused = this.readStream.isPaused;
    unpipe(destination?: NodeJS.WritableStream): this {
        this.readStream.unpipe(destination);
        return this;
    }
    unshift = this.readStream.unshift;
    wrap(stream: NodeJS.ReadableStream): this {
        this.readStream.wrap(stream);
        return this;
    }
    push = this.readStream.push;
    destroy(error?: Error): this {
        this.writeStream.destroy(error);
        this.readStream.destroy(error);
        this.release();
        return this;
    }
    addListener(event: 'close', listener: () => void): this;
    addListener(event: 'data', listener: (chunk: any) => void): this;
    addListener(event: 'end', listener: () => void): this;
    addListener(event: 'error', listener: (err: Error) => void): this;
    addListener(event: 'pause', listener: () => void): this;
    addListener(event: 'readable', listener: () => void): this;
    addListener(event: 'resume', listener: () => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    addListener(event: any, listener: any): this {
        this.readStream.addListener(event,listener);
        return this;
    }
    emit = this.readStream.emit;
    on(event: 'close', listener: () => void): this;
    on(event: 'data', listener: (chunk: any) => void): this;
    on(event: 'end', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'pause', listener: () => void): this;
    on(event: 'readable', listener: () => void): this;
    on(event: 'resume', listener: () => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: any, listener: any): this {
        this.readStream.on(event,listener);
        return this;
    }
    once(event: 'close', listener: () => void): this;
    once(event: 'data', listener: (chunk: any) => void): this;
    once(event: 'end', listener: () => void): this;
    once(event: 'error', listener: (err: Error) => void): this;
    once(event: 'pause', listener: () => void): this;
    once(event: 'readable', listener: () => void): this;
    once(event: 'resume', listener: () => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: any, listener: any): this {
        this.readStream.once(event,listener);
        return this;
    }
    prependListener(event: 'close', listener: () => void): this;
    prependListener(event: 'data', listener: (chunk: any) => void): this;
    prependListener(event: 'end', listener: () => void): this;
    prependListener(event: 'error', listener: (err: Error) => void): this;
    prependListener(event: 'pause', listener: () => void): this;
    prependListener(event: 'readable', listener: () => void): this;
    prependListener(event: 'resume', listener: () => void): this;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(event: any, listener: any): this {
        this.readStream.prependListener(event,listener);
        return this;
    }
    prependOnceListener(event: 'close', listener: () => void): this;
    prependOnceListener(event: 'data', listener: (chunk: any) => void): this;
    prependOnceListener(event: 'end', listener: () => void): this;
    prependOnceListener(event: 'error', listener: (err: Error) => void): this;
    prependOnceListener(event: 'pause', listener: () => void): this;
    prependOnceListener(event: 'readable', listener: () => void): this;
    prependOnceListener(event: 'resume', listener: () => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: any, listener: any): this {
        this.readStream.prependOnceListener(event,listener);
        return this;
    }
    removeListener(event: 'close', listener: () => void): this;
    removeListener(event: 'data', listener: (chunk: any) => void): this;
    removeListener(event: 'end', listener: () => void): this;
    removeListener(event: 'error', listener: (err: Error) => void): this;
    removeListener(event: 'pause', listener: () => void): this;
    removeListener(event: 'readable', listener: () => void): this;
    removeListener(event: 'resume', listener: () => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: any, listener: any): this {
        this.readStream.removeListener(event,listener);
        return this;
    }
    [Symbol.asyncIterator](): AsyncIterableIterator<any> {
        throw new Error('Method not implemented.');
    }
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T {
        throw new Error('Method not implemented.');
    }
    off(eventName: string | symbol, listener: (...args: any[]) => void): this {
        this.writeStream.off(eventName,listener);
        this.readStream.off(eventName,listener);
        return this;
    }
    removeAllListeners(event?: string | symbol): this {
        this.writeStream.removeAllListeners(event);
        this.readStream.removeAllListeners(event);
        return this;
    }
    setMaxListeners(n: number): this {
        this.writeStream.setMaxListeners(n);
        this.readStream.setMaxListeners(n);
        return this;
    }
    getMaxListeners(): number {
        return this.writeStream.getMaxListeners() + this.readStream.getMaxListeners();
    }
    listeners(eventName: string | symbol): Function[] {
        return [...this.writeStream.listeners(eventName), ...this.readStream.listeners(eventName)];
    }
    rawListeners(eventName: string | symbol): Function[] {
        return [...this.writeStream.rawListeners(eventName), ...this.readStream.rawListeners(eventName)];
    }
    listenerCount(eventName: string | symbol): number {
        return this.writeStream.listenerCount(eventName) + this.readStream.listenerCount(eventName);
    }
    eventNames(): (string | symbol)[] {
        return [...this.writeStream.eventNames(), ...this.readStream.eventNames()]
    }
    get writable(): boolean{
        return this.writeStream.writable;
    }
    get writableEnded(): boolean{
        return this.writeStream.writableEnded;
    }
    get writableFinished(): boolean{
        return this.writeStream.writableFinished;
    }
}