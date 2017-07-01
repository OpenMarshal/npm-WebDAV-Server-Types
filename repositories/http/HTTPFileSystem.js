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
var index_1 = require("../../../npm-WebDAV-Server/lib/index");
var request = require("request");
var Resource = (function () {
    function Resource(data) {
        this.props = new index_1.v2.LocalPropertyManager(data ? data.props : undefined);
        this.locks = new index_1.v2.LocalLockManager();
    }
    return Resource;
}());
exports.Resource = Resource;
// Serializer
var WebFileSystemSerializer = (function () {
    function WebFileSystemSerializer() {
    }
    WebFileSystemSerializer.prototype.uid = function () {
        return "WebFileSystemSerializer_1.0.0";
    };
    WebFileSystemSerializer.prototype.serialize = function (fs, callback) {
        callback(null, {
            url: fs.url,
            resources: fs.resources
        });
    };
    WebFileSystemSerializer.prototype.unserialize = function (serializedData, callback) {
        var fs = new WebFileSystem(serializedData.url);
        for (var _i = 0, _a = serializedData.resources; _i < _a.length; _i++) {
            var path = _a[_i];
            serializedData[path] = new Resource(serializedData.resources[path]);
        }
        callback(null, fs);
    };
    return WebFileSystemSerializer;
}());
exports.WebFileSystemSerializer = WebFileSystemSerializer;
// File system
var WebFileSystem = (function (_super) {
    __extends(WebFileSystem, _super);
    function WebFileSystem(url) {
        var _this = _super.call(this, new WebFileSystemSerializer()) || this;
        if (!url)
            url = '';
        if (url.lastIndexOf('/') === url.length - 1)
            url = url.substring(0, url.length - 1);
        _this.resources = {};
        _this.url = url;
        return _this;
    }
    WebFileSystem.prototype.findResource = function (path) {
        var sPath = path.toString();
        var r = this.resources[sPath];
        if (!r)
            return this.resources[sPath] = new Resource();
        return r;
    };
    WebFileSystem.prototype._openReadStream = function (path, info, callback) {
        var stream = request(this.url + path.toString());
        callback(null, stream);
    };
    WebFileSystem.prototype._openWriteStream = function (path, info, callback) {
        var stream = request.put(this.url + path.toString());
        callback(null, stream);
    };
    WebFileSystem.prototype._propertyManager = function (path, info, callback) {
        callback(null, this.findResource(path).props);
    };
    WebFileSystem.prototype._lockManager = function (path, info, callback) {
        callback(null, this.findResource(path).locks);
    };
    WebFileSystem.prototype._size = function (path, info, callback) {
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
    WebFileSystem.prototype._mimeType = function (path, info, callback) {
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
    WebFileSystem.prototype._type = function (path, info, callback) {
        callback(null, index_1.v2.ResourceType.File);
    };
    return WebFileSystem;
}(index_1.v2.FileSystem));
exports.WebFileSystem = WebFileSystem;
