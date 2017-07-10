"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var VirtualStoredAllocator = (function () {
    function VirtualStoredAllocator(folderPath, deCipher) {
        this.folderPath = folderPath;
        this.deCipher = deCipher;
        this.currentUID = 0;
    }
    VirtualStoredAllocator.prototype.initialize = function (callback) {
        var _this = this;
        fs.readdir(this.folderPath, function (e, files) {
            if (e)
                return callback(e);
            files.forEach(function (file) {
                var id = parseInt(file);
                if (!isNaN(id) && _this.currentUID < id)
                    _this.currentUID = id;
            });
            callback();
        });
    };
    VirtualStoredAllocator.prototype.allocate = function () {
        return (++this.currentUID).toString(16);
    };
    VirtualStoredAllocator.prototype.free = function (name) {
        fs.unlink(this.fullPath(name));
    };
    VirtualStoredAllocator.prototype.fullPath = function (name) {
        return path.join(this.folderPath, name);
    };
    VirtualStoredAllocator.prototype.readStream = function (name) {
        var cipher = this.deCipher.newDecipher(name);
        return fs.createReadStream(this.fullPath(name)).pipe(cipher);
    };
    VirtualStoredAllocator.prototype.writeStream = function (name) {
        var cipher = this.deCipher.newCipher(name);
        cipher.pipe(fs.createWriteStream(this.fullPath(name)));
        return cipher;
    };
    return VirtualStoredAllocator;
}());
exports.VirtualStoredAllocator = VirtualStoredAllocator;
