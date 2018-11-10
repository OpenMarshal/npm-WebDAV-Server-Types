"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var DropboxFileSystem_1 = require("./DropboxFileSystem");
var DropboxSerializer_1 = require("./DropboxSerializer");
__export(require("./DropboxFileSystem"));
__export(require("./DropboxSerializer"));
exports.info = {
    settings: [{
            key: 'accessKey',
            type: 'string',
            required: true
        }],
    fs: DropboxFileSystem_1.DropboxFileSystem,
    serializer: new DropboxSerializer_1.DropboxSerializer()
};
