"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webdav_server_1 = require("webdav-server");
var VirtualStoredResource = (function () {
    function VirtualStoredResource(data) {
        if (data.constructor === webdav_server_1.v2.ResourceType) {
            this.type = data;
            this.propertyManager = new webdav_server_1.v2.LocalPropertyManager();
            this.creationDate = Date.now();
            this.lastModifiedDate = this.creationDate;
            this.contentUID = undefined;
        }
        else {
            var r = data;
            this.type = r.type;
            this.propertyManager = new webdav_server_1.v2.LocalPropertyManager(r.propertyManager);
            this.creationDate = r.creationDate;
            this.lastModifiedDate = r.lastModifiedDate;
            this.contentUID = r.contentUID;
        }
        this.lockManager = new webdav_server_1.v2.LocalLockManager();
    }
    return VirtualStoredResource;
}());
exports.VirtualStoredResource = VirtualStoredResource;
