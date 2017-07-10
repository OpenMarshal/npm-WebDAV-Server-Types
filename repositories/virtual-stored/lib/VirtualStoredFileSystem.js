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
var VirtualStoredResource_1 = require("./VirtualStoredResource");
var webdav_server_1 = require("webdav-server");
var VirtualStoredFileSystem = (function (_super) {
    __extends(VirtualStoredFileSystem, _super);
    function VirtualStoredFileSystem(allocator) {
        var _this = _super.call(this, null) || this;
        _this.allocator = allocator;
        _this.resources = {
            '/': new VirtualStoredResource_1.VirtualStoredResource(webdav_server_1.v2.ResourceType.Directory)
        };
        return _this;
    }
    VirtualStoredFileSystem.prototype._fastExistCheck = function (ctx, path, callback) {
        callback(!!this.resources[path.toString()]);
    };
    VirtualStoredFileSystem.prototype._create = function (path, ctx, callback) {
        var r = this.resources[path.toString()];
        if (r)
            return callback(webdav_server_1.v2.Errors.ResourceAlreadyExists);
        r = new VirtualStoredResource_1.VirtualStoredResource(ctx.type);
        var id = this.allocator.allocate();
        r.contentUID = id;
        this.resources[path.toString()] = r;
        callback();
    };
    VirtualStoredFileSystem.prototype._delete = function (path, ctx, callback) {
        var r = this.resources[path.toString()];
        if (!r)
            return callback(webdav_server_1.v2.Errors.ResourceNotFound);
        this.allocator.free(r.contentUID);
        delete this.resources[path.toString()];
        callback();
    };
    VirtualStoredFileSystem.prototype._openWriteStream = function (path, ctx, callback) {
        var r = this.resources[path.toString()];
        if (!r)
            return callback(webdav_server_1.v2.Errors.ResourceNotFound);
        callback(null, this.allocator.writeStream(r.contentUID));
    };
    VirtualStoredFileSystem.prototype._openReadStream = function (path, ctx, callback) {
        var r = this.resources[path.toString()];
        if (!r)
            return callback(webdav_server_1.v2.Errors.ResourceNotFound);
        callback(null, this.allocator.readStream(r.contentUID));
    };
    VirtualStoredFileSystem.prototype._lockManager = function (path, ctx, callback) {
        var r = this.resources[path.toString()];
        callback(r ? null : webdav_server_1.v2.Errors.ResourceNotFound, r ? r.lockManager : null);
    };
    VirtualStoredFileSystem.prototype._propertyManager = function (path, ctx, callback) {
        var r = this.resources[path.toString()];
        callback(r ? null : webdav_server_1.v2.Errors.ResourceNotFound, r ? r.propertyManager : null);
    };
    VirtualStoredFileSystem.prototype._readDir = function (path, ctx, callback) {
        var sPath = path.toString(true);
        var paths = [];
        for (var path_1 in this.resources)
            if (path_1.length > sPath.length && path_1.indexOf(sPath) === 0)
                paths.push(path_1);
        callback(null, paths);
    };
    VirtualStoredFileSystem.prototype._creationDate = function (path, ctx, callback) {
        var r = this.resources[path.toString()];
        callback(r ? null : webdav_server_1.v2.Errors.ResourceNotFound, r ? r.creationDate : null);
    };
    VirtualStoredFileSystem.prototype._lastModifiedDate = function (path, ctx, callback) {
        var r = this.resources[path.toString()];
        callback(r ? null : webdav_server_1.v2.Errors.ResourceNotFound, r ? r.lastModifiedDate : null);
    };
    VirtualStoredFileSystem.prototype._type = function (path, ctx, callback) {
        var r = this.resources[path.toString()];
        callback(r ? null : webdav_server_1.v2.Errors.ResourceNotFound, r ? r.type : null);
    };
    return VirtualStoredFileSystem;
}(webdav_server_1.v2.FileSystem));
exports.VirtualStoredFileSystem = VirtualStoredFileSystem;
