"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DropboxFileSystem_1 = require("./DropboxFileSystem");
var DropboxSerializer = (function () {
    function DropboxSerializer() {
    }
    DropboxSerializer.prototype.uid = function () {
        return 'DropboxFSSerializer-1.0.0';
    };
    DropboxSerializer.prototype.serialize = function (fs, callback) {
        callback(null, {
            accessKey: fs.accessKey
        });
    };
    DropboxSerializer.prototype.unserialize = function (serializedData, callback) {
        var fs = new DropboxFileSystem_1.DropboxFileSystem(serializedData.accessKey);
        callback(null, fs);
    };
    return DropboxSerializer;
}());
exports.DropboxSerializer = DropboxSerializer;
