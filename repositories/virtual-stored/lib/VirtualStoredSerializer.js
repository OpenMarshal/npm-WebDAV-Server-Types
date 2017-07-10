"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeCipher_1 = require("./DeCipher");
var VirtualStoredFileSystem_1 = require("./VirtualStoredFileSystem");
var VirtualStoredAllocator_1 = require("./VirtualStoredAllocator");
var VirtualStoredResource_1 = require("./VirtualStoredResource");
var VirtualStoredSerializer = (function () {
    function VirtualStoredSerializer(password, deCipherOptions) {
        this.decipher = new DeCipher_1.DeCipher(password, deCipherOptions);
    }
    VirtualStoredSerializer.prototype.uid = function () {
        return 'VirtualStoredSerializer-' + this.decipher.uid() + '-1.0.0';
    };
    VirtualStoredSerializer.prototype.serialize = function (fs, callback) {
        callback(null, {
            path: fs.allocator.folderPath,
            resources: fs.resources
        });
    };
    VirtualStoredSerializer.prototype.unserialize = function (serializedData, callback) {
        this.createNewFileSystem(serializedData.path, function (e, fs) {
            if (e)
                return callback(e);
            for (var path in serializedData.resources)
                fs.resources[path] = new VirtualStoredResource_1.VirtualStoredResource(serializedData.resources[path]);
            callback(null, fs);
        });
    };
    VirtualStoredSerializer.prototype.createNewFileSystem = function (path, callback) {
        var _this = this;
        var allocator = new VirtualStoredAllocator_1.VirtualStoredAllocator(path, this.decipher);
        allocator.initialize(function (e) {
            if (e)
                return callback(e);
            var fs = new VirtualStoredFileSystem_1.VirtualStoredFileSystem(allocator);
            fs.setSerializer(_this);
            callback(null, fs);
        });
    };
    return VirtualStoredSerializer;
}());
exports.VirtualStoredSerializer = VirtualStoredSerializer;
