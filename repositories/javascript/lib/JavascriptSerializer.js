"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var JavascriptFileSystem_1 = require("./JavascriptFileSystem");
var webdav_server_1 = require("webdav-server");
var JavascriptSerializer = (function (_super) {
    __extends(JavascriptSerializer, _super);
    function JavascriptSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JavascriptSerializer.prototype.uid = function () {
        return 'JavascriptSerializer-1.0.0';
    };
    JavascriptSerializer.prototype.serialize = function (fs, callback) {
        _super.prototype.serialize.call(this, fs, function (e, data) {
            if (e)
                return callback(e);
            data.currentWorkingDirectory = fs.currentWorkingDirectory;
            data.useEval = fs.useEval;
            callback(null, data);
        });
    };
    JavascriptSerializer.prototype.unserialize = function (serializedData, callback) {
        var _this = this;
        _super.prototype.unserialize.call(this, serializedData, function (e, fs) {
            if (e)
                return callback(e);
            var ffs = new JavascriptFileSystem_1.JavascriptFileSystem(serializedData.useEval, serializedData.currentWorkingDirectory);
            for (var name_1 in fs)
                ffs[name_1] = fs[name_1];
            ffs.setSerializer(_this);
            callback(null, ffs);
        });
    };
    return JavascriptSerializer;
}(webdav_server_1.v2.VirtualSerializer));
exports.JavascriptSerializer = JavascriptSerializer;
