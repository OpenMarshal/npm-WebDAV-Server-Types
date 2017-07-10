"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var DeCipher = (function () {
    function DeCipher(password, config) {
        var _this = this;
        this.config = config;
        var sha1 = crypto.createHash('sha1');
        sha1.update([
            'masterNbIteration',
            'minorNbIteration',
            'cipherIvSize',
            'keyLen',
            'cipher',
            'hash'
        ].map(function (k) { return _this.config[k]; }).join(':'));
        this.sUid = sha1.digest('hex');
        var salt = config.salt.constructor === Buffer ? config.salt : new Buffer(config.salt);
        this.master = crypto.pbkdf2Sync(password, salt, this.config.masterNbIteration, this.config.keyLen, this.config.hash);
        var hmac = crypto.createHmac(this.config.hash, this.master);
        hmac.update('key');
        this.key = hmac.digest();
    }
    DeCipher.prototype.uid = function () {
        return this.sUid;
    };
    DeCipher.prototype.buildIV = function (seed) {
        var ivSeed = crypto.pbkdf2Sync(seed, this.master, this.config.minorNbIteration, this.config.keyLen, this.config.hash);
        var hmac = crypto.createHmac(this.config.hash, ivSeed);
        hmac.update('iv');
        return hmac.digest().slice(0, this.config.cipherIvSize);
    };
    DeCipher.prototype.newCipher = function (seed) {
        var cipher = crypto.createCipheriv(this.config.cipher, this.key, this.buildIV(seed));
        return cipher;
    };
    DeCipher.prototype.newDecipher = function (seed) {
        var cipher = crypto.createDecipheriv(this.config.cipher, this.key, this.buildIV(seed));
        return cipher;
    };
    return DeCipher;
}());
exports.DeCipher = DeCipher;
