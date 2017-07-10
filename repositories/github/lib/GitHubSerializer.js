"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GitHubFileSystem_1 = require("./GitHubFileSystem");
var webdav_server_1 = require("webdav-server");
var GitHubSerializer = (function () {
    function GitHubSerializer() {
    }
    GitHubSerializer.prototype.uid = function () {
        return 'GitHubSerializer-1.0.0';
    };
    GitHubSerializer.prototype.serialize = function (fs, callback) {
        callback(null, {
            properties: fs.properties,
            organisation: fs.organisation,
            client_id: fs.client_id,
            client_secret: fs.client_secret,
            repository: fs.repository
        });
    };
    GitHubSerializer.prototype.unserialize = function (serializedData, callback) {
        var fs = new GitHubFileSystem_1.GitHubFileSystem(serializedData.organisation, serializedData.repository, serializedData.client_id, serializedData.client_secret);
        for (var path in serializedData.properties)
            fs.properties[path] = new webdav_server_1.v2.LocalPropertyManager(serializedData.properties[path]);
        callback(null, fs);
    };
    return GitHubSerializer;
}());
exports.GitHubSerializer = GitHubSerializer;
