/// <reference types="node" />
import { Readable, Writable, Duplex } from "stream";
export declare class ReadableTemplate extends Readable {
    private _readable;
    constructor(factory: () => Readable);
    protected get internalReadable(): Readable;
    _read(size: number): void;
}
export declare class WritableTemplate extends Writable {
    private _writable;
    constructor(factory: () => {
        writable: Writable;
        keepInternalWritableOpenWhenFinish?: boolean;
    });
    protected get internalWritable(): Writable;
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void;
}
export declare class IOTemplate extends Duplex {
    private _writable;
    private _readable;
    constructor(factory: () => {
        writable: Writable;
        readable: Readable;
    });
    protected get internalReadable(): Readable;
    protected get internalWritable(): Writable;
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void;
    _read(size: number): void;
}
