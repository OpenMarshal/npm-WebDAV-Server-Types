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
var GitHubSerializer_1 = require("./GitHubSerializer");
var webdav_server_1 = require("webdav-server");
var request = require("request");
var GitHubFileSystem = (function (_super) {
    __extends(GitHubFileSystem, _super);
    function GitHubFileSystem(organisation, repository, client_id, client_secret) {
        var _this = _super.call(this, new GitHubSerializer_1.GitHubSerializer()) || this;
        _this.organisation = organisation;
        _this.repository = repository;
        _this.client_id = client_id;
        _this.client_secret = client_secret;
        _this.properties = {};
        _this.cache = {};
        _this.base = 'https://api.github.com/repos/' + organisation + '/' + repository + '/contents';
        if (_this.base.lastIndexOf('/') === _this.base.length - 1)
            _this.base = _this.base.substring(0, _this.base.length - 1);
        return _this;
    }
    GitHubFileSystem.prototype._parse = function (subPath, callback) {
        var _this = this;
        var url = this.base + subPath.toString();
        var cached = this.cache[url];
        if (cached && cached.date + 5000 < Date.now())
            return callback(cached.error, cached.body);
        request({
            url: url,
            method: 'GET',
            qs: {
                'client_id': this.client_id,
                'client_secret': this.client_secret
            },
            headers: {
                'user-agent': 'webdav-server'
            }
        }, function (e, res, body) {
            if (res.statusCode === 404)
                e = webdav_server_1.v2.Errors.ResourceNotFound;
            if (body)
                body = JSON.parse(body);
            if (!e && body.message)
                e = new Error(body.message);
            _this.cache[url] = {
                body: body,
                error: e,
                date: Date.now()
            };
            callback(e, body);
        });
    };
    GitHubFileSystem.prototype._openReadStream = function (path, ctx, callback) {
        var _this = this;
        this._parse(path, function (e, data) {
            if (e)
                return callback(e);
            if (data.constructor === Array)
                return callback(webdav_server_1.v2.Errors.InvalidOperation);
            var stream = request({
                url: data.download_url,
                method: 'GET',
                qs: {
                    'client_id': _this.client_id,
                    'client_secret': _this.client_secret
                },
                headers: {
                    'user-agent': 'webdav-server'
                }
            });
            stream.end();
            callback(null, stream);
        });
    };
    GitHubFileSystem.prototype._lockManager = function (path, ctx, callback) {
        callback(null, new webdav_server_1.v2.LocalLockManager());
    };
    GitHubFileSystem.prototype._propertyManager = function (path, ctx, callback) {
        var _this = this;
        if (path.isRoot()) {
            var props = this.properties[path.toString()];
            if (!props) {
                props = new webdav_server_1.v2.LocalPropertyManager();
                this.properties[path.toString()] = props;
            }
            return callback(null, props);
        }
        this._parse(path.getParent(), function (e, data) {
            if (e)
                return callback(e);
            var props = _this.properties[path.toString()];
            if (!props) {
                props = new webdav_server_1.v2.LocalPropertyManager();
                _this.properties[path.toString()] = props;
            }
            var info = data;
            var _loop_1 = function (file) {
                if (file.name === path.fileName()) {
                    var github_1 = [];
                    var create = function (name, value) {
                        var el = webdav_server_1.v2.XML.createElement(name);
                        if (value !== null && value !== undefined)
                            el.add(value);
                        github_1.push(el);
                    };
                    create('json', JSON.stringify(file));
                    create('path', file.path);
                    create('sha', file.sha);
                    create('size', file.size);
                    create('url', file.url);
                    create('html-url', file.html_url);
                    create('git-url', file.git_url);
                    create('download-url', file.download_url);
                    create('type', file.type);
                    var links = webdav_server_1.v2.XML.createElement('links');
                    for (var name_1 in file._links)
                        links.ele(name_1).add(file._links[name_1]);
                    props.setProperty('github', github_1, undefined, function (e) {
                        callback(e, props);
                    });
                    return { value: void 0 };
                }
            };
            for (var _i = 0, info_1 = info; _i < info_1.length; _i++) {
                var file = info_1[_i];
                var state_1 = _loop_1(file);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            callback(webdav_server_1.v2.Errors.ResourceNotFound, props);
        });
    };
    GitHubFileSystem.prototype._readDir = function (path, ctx, callback) {
        this._parse(path, function (e, data) {
            if (e)
                return callback(e);
            if (data.constructor !== Array)
                return callback(webdav_server_1.v2.Errors.InvalidOperation);
            callback(null, data.map(function (r) { return r.name; }));
        });
    };
    GitHubFileSystem.prototype._size = function (path, ctx, callback) {
        this._parse(path, function (e, data) {
            callback(e, data && data.constructor !== Array ? data.size : undefined);
        });
    };
    GitHubFileSystem.prototype._type = function (path, ctx, callback) {
        if (path.isRoot())
            return callback(null, webdav_server_1.v2.ResourceType.Directory);
        this._parse(path, function (e, data) {
            callback(e, data ? data.constructor === Array ? webdav_server_1.v2.ResourceType.Directory : webdav_server_1.v2.ResourceType.File : null);
        });
    };
    return GitHubFileSystem;
}(webdav_server_1.v2.FileSystem));
exports.GitHubFileSystem = GitHubFileSystem;
