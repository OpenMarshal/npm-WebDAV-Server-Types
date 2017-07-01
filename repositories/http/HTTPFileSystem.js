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
var webdav_server_1 = require("webdav-server");
var request = require("request");
var Resource = (function () {
    function Resource(data) {
        this.props = new webdav_server_1.v2.LocalPropertyManager(data ? data.props : undefined);
        this.locks = new webdav_server_1.v2.LocalLockManager();
    }
    return Resource;
}());
exports.Resource = Resource;
// Serializer
var HTTPFileSystemSerializer = (function () {
    function HTTPFileSystemSerializer() {
    }
    HTTPFileSystemSerializer.prototype.uid = function () {
        return "HTTPFileSystemSerializer_1.0.0";
    };
    HTTPFileSystemSerializer.prototype.serialize = function (fs, callback) {
        callback(null, {
            url: fs.url,
            resources: fs.resources
        });
    };
    HTTPFileSystemSerializer.prototype.unserialize = function (serializedData, callback) {
        var fs = new HTTPFileSystem(serializedData.url);
        for (var _i = 0, _a = serializedData.resources; _i < _a.length; _i++) {
            var path = _a[_i];
            serializedData[path] = new Resource(serializedData.resources[path]);
        }
        callback(null, fs);
    };
    return HTTPFileSystemSerializer;
}());
exports.HTTPFileSystemSerializer = HTTPFileSystemSerializer;
// File system
var HTTPFileSystem = (function (_super) {
    __extends(HTTPFileSystem, _super);
    function HTTPFileSystem(url) {
        var _this = _super.call(this, new HTTPFileSystemSerializer()) || this;
        if (!url)
            url = '';
        if (url.lastIndexOf('/') === url.length - 1)
            url = url.substring(0, url.length - 1);
        _this.resources = {};
        _this.url = url;
        return _this;
    }
    HTTPFileSystem.prototype.findResource = function (path) {
        var sPath = path.toString();
        var r = this.resources[sPath];
        if (!r)
            return this.resources[sPath] = new Resource();
        return r;
    };
    HTTPFileSystem.prototype._openReadStream = function (path, info, callback) {
        var stream = request(this.url + path.toString());
        callback(null, stream);
    };
    HTTPFileSystem.prototype._openWriteStream = function (path, info, callback) {
        var stream = request.put(this.url + path.toString());
        callback(null, stream);
    };
    HTTPFileSystem.prototype._propertyManager = function (path, info, callback) {
        callback(null, this.findResource(path).props);
    };
    HTTPFileSystem.prototype._lockManager = function (path, info, callback) {
        callback(null, this.findResource(path).locks);
    };
    HTTPFileSystem.prototype._size = function (path, info, callback) {
        request({
            url: this.url + path.toString(),
            method: 'HEAD'
        }, function (e, res) {
            if (e)
                return callback(e);
            var contentLength = res.headers['content-length'];
            console.log(res.headers);
            console.log(contentLength);
            if (contentLength)
                callback(null, parseInt(contentLength.constructor === String ? contentLength : contentLength[0]));
            else
                callback(null, undefined);
        });
    };
    HTTPFileSystem.prototype._mimeType = function (path, info, callback) {
        request({
            url: this.url + path.toString(),
            method: 'HEAD'
        }, function (e, res) {
            if (e)
                return callback(e);
            var contentType = res.headers['content-type'];
            if (contentType)
                callback(null, contentType.constructor === String ? contentType : contentType[0]);
            else
                callback(null, 'application/octet-stream');
        });
    };
    HTTPFileSystem.prototype._type = function (path, info, callback) {
        callback(null, webdav_server_1.v2.ResourceType.File);
    };
    return HTTPFileSystem;
}(webdav_server_1.v2.FileSystem));
exports.HTTPFileSystem = HTTPFileSystem;
