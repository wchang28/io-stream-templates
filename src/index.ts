import {Readable, Writable, Duplex} from "stream";

export class ReadableTemplate extends Readable {
    private _readable: Readable;    // internal readable
    constructor(factory: () => Readable) {
        super();
        this._readable = factory(); // create the internal readable

        this._readable.on("data", (chunk) => {
            if (!this.push(chunk)) {
                this._readable.pause();
            }
        }).on("end", () => {
            this.push(null);    // this will cause the "end" event to be fired on the read side
        }).on("error", (err) => {
            this.emit("error", err);
        });
    }

    protected get internalReadable() {return this._readable;}

    _read(size: number) {
        this._readable.resume();
    }
}

export class WritableTemplate extends Writable {
    private _writable: Writable;    // internal writable
    constructor(factory: () => Writable) {
        super();
        this._writable = factory(); // create the internal writable

        this._writable.on("error", (err) => {
            this.emit("error", err);
        });
        this.on("finish", () => {   // end() was called on this object
            this._writable.end();   // end the writable
        });
    }

    protected get internalWritable() {return this._writable;}

    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
        this._writable.write(chunk, encoding, callback);
    }
}

export class IOTemplate extends Duplex {
    private _writable: Writable;    // internal writable
    private _readable: Readable;    // internal readable

    constructor(factory: () => {writable: Writable, readable:  Readable}) {
        super();
        const ret = factory();    // create the io streams
        this._writable = ret.writable;
        this._readable = ret.readable;

        this._readable.on("data", (chunk) => {
            if (!this.push(chunk)) {
                this._readable.pause();
            }
        }).on("end", () => {
            this.push(null);    // this will cause the "end" event to be fired on the read side
        }).on("error", (err) => {
            this.emit("error", err);
        });

        this._writable.on("error", (err) => {
            this.emit("error", err);
        });
        this.on("finish", () => {   // end() was called on this object
            this._writable.end();   // end the writable
        });
    }

    protected get internalReadable() {return this._readable;}
    protected get internalWritable() {return this._writable;}

    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
        this._writable.write(chunk, encoding, callback);
    }

    _read(size: number) {
        this._readable.resume();
    }
}
