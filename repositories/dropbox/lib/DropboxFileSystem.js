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
var fetch = require("isomorphic-fetch");
var DropboxSerializer_1 = require("./DropboxSerializer");
var webdav_server_1 = require("webdav-server");
var dropbox_1 = require("dropbox");
var DropboxFileSystem = (function (_super) {
    __extends(DropboxFileSystem, _super);
    function DropboxFileSystem(accessKey) {
        var _this = _super.call(this, new DropboxSerializer_1.DropboxSerializer()) || this;
        _this.accessKey = accessKey;
        _this.dbx = new dropbox_1.Dropbox({ accessToken: _this.accessKey, fetch: fetch });
        _this.resources = {};
        _this.useCache = true;
        return _this;
        /*
        var _this = _super.call(this, serializer ? serializer : new VirtualSerializer()) || this;
        _this.resources = {
            '/': new VirtualFileSystemResource(export_1.ResourceType.Directory)
        };*/
    }
    DropboxFileSystem.prototype.getRemotePath = function (path) {
        var pathStr = path.toString();
        if (pathStr === '/')
            return '';
        else
            return pathStr;
    };
    DropboxFileSystem.prototype.getMetaData = function (path, callback) {
        var _this = this;
        if (this.useCache && this.resources[path.toString(false)] && this.resources[path.toString(false)].metadata) {
            callback(undefined, this.resources[path.toString(false)].metadata);
        }
        else {
            if (path.isRoot()) {
                callback(undefined, {
                    '.tag': 'folder',
                    name: '',
                    size: 0
                });
            }
            else {
                this.dbx.filesGetMetadata({
                    path: this.getRemotePath(path)
                }).then(function (data) {
                    if (!_this.resources[path.toString(false)])
                        _this.resources[path.toString(false)] = {};
                    _this.resources[path.toString(false)].metadata = data;
                    callback(undefined, data);
                }).catch(function (e) {
                    callback(e);
                });
            }
        }
    };
    DropboxFileSystem.prototype._rename = function (pathFrom, newName, ctx, callback) {
        this.dbx.filesMoveV2({
            from_path: this.getRemotePath(pathFrom),
            to_path: this.getRemotePath(newName),
            allow_ownership_transfer: true,
            allow_shared_folder: true
        }).then(function () {
            callback(undefined, true);
        })
            .catch(function (e) {
            callback(webdav_server_1.v2.Errors.InvalidOperation);
        });
    };
    DropboxFileSystem.prototype._create = function (path, ctx, callback) {
        if (ctx.type.isFolder) {
            this.dbx.filesCreateFolderV2({
                path: this.getRemotePath(path)
            }).then(function () {
                callback();
            }).catch(function (e) {
                callback();
            });
        }
        else {
            this.dbx.filesUpload({
                path: this.getRemotePath(path),
                contents: 'empty'
            }).then(function () {
                callback();
            }).catch(function (e) {
                callback();
            });
        }
    };
    DropboxFileSystem.prototype._delete = function (path, ctx, callback) {
        var _this = this;
        this.dbx.filesDelete({
            path: this.getRemotePath(path)
        }).then(function () {
            delete _this.resources[path.toString(false)];
            callback();
        }).catch(function (e) {
            callback();
        });
    };
    ;
    DropboxFileSystem.prototype._openWriteStream = function (path, ctx, callback) {
        var _this = this;
        this.getMetaData(path, function (e, data) {
            if (e) {
                return callback(webdav_server_1.v2.Errors.ResourceNotFound);
            }
            var content = [];
            var stream = new webdav_server_1.v2.VirtualFileWritable(content);
            stream.on('finish', function () {
                _this.dbx.filesUpload({
                    path: _this.getRemotePath(path),
                    contents: content,
                    strict_conflict: false,
                    mode: {
                        '.tag': 'overwrite'
                    }
                }).then(function () {
                }).catch(function (e) {
                });
            });
            callback(null, stream);
        });
    };
    ;
    DropboxFileSystem.prototype._openReadStream = function (path, ctx, callback) {
        this.dbx.filesDownload({
            path: this.getRemotePath(path)
        }).then(function (r) {
            var stream = new webdav_server_1.v2.VirtualFileReadable([r.fileBinary]);
            callback(undefined, stream);
        }).catch(function (e) {
            callback(webdav_server_1.v2.Errors.ResourceNotFound);
        });
    };
    ;
    DropboxFileSystem.prototype._size = function (path, ctx, callback) {
        var _this = this;
        this.getMetaData(path, function (e, data) {
            if (e)
                return callback(webdav_server_1.v2.Errors.ResourceNotFound);
            if (!_this.resources[path.toString(false)])
                _this.resources[path.toString(false)] = {};
            _this.resources[path.toString(false)].size = data.size;
            callback(undefined, data.size);
        });
    };
    ;
    DropboxFileSystem.prototype._lockManager = function (path, ctx, callback) {
        var _this = this;
        this.getMetaData(path, function (e) {
            if (e) {
                return callback(webdav_server_1.v2.Errors.ResourceNotFound);
            }
            if (!_this.resources[path.toString(false)])
                _this.resources[path.toString(false)] = {};
            if (!_this.resources[path.toString(false)].locks)
                _this.resources[path.toString(false)].locks = new webdav_server_1.v2.LocalLockManager();
            callback(undefined, _this.resources[path.toString(false)].locks);
        });
    };
    ;
    DropboxFileSystem.prototype._propertyManager = function (path, ctx, callback) {
        var _this = this;
        this.getMetaData(path, function (e) {
            if (e)
                return callback(webdav_server_1.v2.Errors.ResourceNotFound);
            if (!_this.resources[path.toString(false)])
                _this.resources[path.toString(false)] = {};
            if (!_this.resources[path.toString(false)].props)
                _this.resources[path.toString(false)].props = new webdav_server_1.v2.LocalPropertyManager({});
            callback(undefined, _this.resources[path.toString(false)].props);
        });
    };
    ;
    DropboxFileSystem.prototype._readDir = function (path, ctx, callback) {
        this.dbx.filesListFolder({
            path: this.getRemotePath(path)
        }).then(function (data) {
            var files = data.entries.map(function (entry) { return entry.name; });
            callback(undefined, files);
        }).catch(function (e) {
            callback(webdav_server_1.v2.Errors.ResourceNotFound);
        });
    };
    ;
    DropboxFileSystem.prototype._creationDate = function (path, ctx, callback) {
        this._lastModifiedDate(path, ctx, callback);
    };
    ;
    DropboxFileSystem.prototype._lastModifiedDate = function (path, ctx, callback) {
        this.getMetaData(path, function (e, data) {
            if (e)
                return callback(webdav_server_1.v2.Errors.ResourceNotFound);
            callback(undefined, data.client_modified || data.server_modified);
        });
    };
    ;
    DropboxFileSystem.prototype._type = function (path, ctx, callback) {
        var _this = this;
        if (this.useCache && this.resources[path.toString(false)] && this.resources[path.toString(false)].type) {
            callback(undefined, this.resources[path.toString(false)].type);
        }
        else {
            this.getMetaData(path, function (e, data) {
                if (e)
                    return callback(webdav_server_1.v2.Errors.ResourceNotFound);
                var isFolder = data['.tag'] === 'folder';
                var type = isFolder ? webdav_server_1.v2.ResourceType.Directory : webdav_server_1.v2.ResourceType.File;
                if (!_this.resources[path.toString(false)])
                    _this.resources[path.toString(false)] = {};
                _this.resources[path.toString(false)].type = type;
                callback(undefined, type);
            });
        }
    };
    ;
    return DropboxFileSystem;
}(webdav_server_1.v2.FileSystem));
exports.DropboxFileSystem = DropboxFileSystem;
