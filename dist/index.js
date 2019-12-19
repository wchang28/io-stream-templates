"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
var ReadableTemplate = /** @class */ (function (_super) {
    __extends(ReadableTemplate, _super);
    function ReadableTemplate(factory) {
        var _this = _super.call(this) || this;
        _this._readable = factory(); // create the internal readable
        _this._readable.on("data", function (chunk) {
            if (!_this.push(chunk)) {
                _this._readable.pause();
            }
        }).on("end", function () {
            _this.push(null); // this will cause the "end" event to be fired on the read side
        }).on("error", function (err) {
            _this.emit("error", err);
        });
        return _this;
    }
    Object.defineProperty(ReadableTemplate.prototype, "internalReadable", {
        get: function () { return this._readable; },
        enumerable: true,
        configurable: true
    });
    ReadableTemplate.prototype._read = function (size) {
        this._readable.resume();
    };
    return ReadableTemplate;
}(stream_1.Readable));
exports.ReadableTemplate = ReadableTemplate;
var WritableTemplate = /** @class */ (function (_super) {
    __extends(WritableTemplate, _super);
    function WritableTemplate(factory) {
        var _this = _super.call(this) || this;
        var ret = factory(); // create the internal writable
        _this._writable = ret.writable;
        var endInternalWritableWhenFinish = (ret.keepInternalWritableOpenWhenFinish ? false : true);
        _this._writable.on("error", function (err) {
            _this.emit("error", err);
        });
        _this.on("finish", function () {
            if (endInternalWritableWhenFinish) {
                _this._writable.end(); // end the writable
            }
        });
        return _this;
    }
    Object.defineProperty(WritableTemplate.prototype, "internalWritable", {
        get: function () { return this._writable; },
        enumerable: true,
        configurable: true
    });
    WritableTemplate.prototype._write = function (chunk, encoding, callback) {
        this._writable.write(chunk, encoding, callback);
    };
    return WritableTemplate;
}(stream_1.Writable));
exports.WritableTemplate = WritableTemplate;
var IOTemplate = /** @class */ (function (_super) {
    __extends(IOTemplate, _super);
    function IOTemplate(factory) {
        var _this = _super.call(this) || this;
        var ret = factory(); // create the io streams
        _this._writable = ret.writable;
        _this._readable = ret.readable;
        _this._readable.on("data", function (chunk) {
            if (!_this.push(chunk)) {
                _this._readable.pause();
            }
        }).on("end", function () {
            _this.push(null); // this will cause the "end" event to be fired on the read side
        }).on("error", function (err) {
            _this.emit("error", err);
        });
        _this._writable.on("error", function (err) {
            _this.emit("error", err);
        });
        _this.on("finish", function () {
            _this._writable.end(); // end the writable
        });
        return _this;
    }
    Object.defineProperty(IOTemplate.prototype, "internalReadable", {
        get: function () { return this._readable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IOTemplate.prototype, "internalWritable", {
        get: function () { return this._writable; },
        enumerable: true,
        configurable: true
    });
    IOTemplate.prototype._write = function (chunk, encoding, callback) {
        this._writable.write(chunk, encoding, callback);
    };
    IOTemplate.prototype._read = function (size) {
        this._readable.resume();
    };
    return IOTemplate;
}(stream_1.Duplex));
exports.IOTemplate = IOTemplate;
//# sourceMappingURL=index.js.map