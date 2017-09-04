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
var JavascriptSerializer_1 = require("./JavascriptSerializer");
var stream_1 = require("stream");
var webdav_server_1 = require("webdav-server");
var child_process_1 = require("child_process");
var JavascriptFileSystemOptionsDefaults = (function () {
    function JavascriptFileSystemOptionsDefaults() {
        this.useEval = false;
        this.disableSourceReading = false;
    }
    return JavascriptFileSystemOptionsDefaults;
}());
var JavascriptFileSystem = (function (_super) {
    __extends(JavascriptFileSystem, _super);
    function JavascriptFileSystem(options) {
        var _this = _super.call(this, new JavascriptSerializer_1.JavascriptSerializer()) || this;
        _this.options = options;
        var defaultValues = new JavascriptFileSystemOptionsDefaults();
        for (var _i = 0, _a = Object.keys(defaultValues); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            if (_this.options[name_1] === undefined)
                _this.options[name_1] = defaultValues[name_1];
        }
        return _this;
    }
    JavascriptFileSystem.prototype._openReadStream = function (path, ctx, callback) {
        var _this = this;
        _super.prototype._openReadStream.call(this, path, ctx, function (e, rStream) {
            if (e)
                return callback(e);
            if (ctx.targetSource && !_this.options.disableSourceReading)
                return callback(e, rStream);
            if (_this.options.useEval) {
                var data_1 = '';
                rStream.on('data', function (chunk) {
                    data_1 += chunk.toString();
                });
                rStream.on('end', function () {
                    if (!data_1 || data_1.length === 0)
                        return callback(null, new stream_1.Readable({
                            read: function () {
                                this.push(null);
                                return false;
                            }
                        }));
                    var go = function (value) {
                        if (!go)
                            return;
                        go = function () { };
                        callback(null, new stream_1.Readable({
                            read: function () {
                                this.push(value.toString());
                                this.push(null);
                                return false;
                            }
                        }));
                    };
                    var result = eval('(function(systemCallback){' + data_1 + '})')(function (value) {
                        go(value);
                    });
                    if (result)
                        go(result);
                });
                return;
            }
            var p = child_process_1.spawn('node', [], {
                cwd: _this.options.currentWorkingDirectory
            });
            if (!p.pid)
                return callback(webdav_server_1.v2.Errors.Forbidden);
            rStream.pipe(p.stdin);
            p.stderr.pipe(process.stdout);
            callback(null, p.stdout);
        });
    };
    JavascriptFileSystem.prototype._size = function (path, ctx, callback) {
        callback(null, undefined);
    };
    return JavascriptFileSystem;
}(webdav_server_1.v2.VirtualFileSystem));
exports.JavascriptFileSystem = JavascriptFileSystem;
