import * as fetch from 'isomorphic-fetch'

import { DropboxSerializer } from './DropboxSerializer'
import { v2 as webdav } from 'webdav-server'
import { Dropbox } from 'dropbox'

export class DropboxFileSystem extends webdav.FileSystem
{
    getRemotePath(path) {
        var pathStr = path.toString();
        if(pathStr === '/')
            return '';
        else
            return pathStr;
    }

    getMetaData(path, callback) {
        if(this.useCache && this.resources[path.toString(false)] && this.resources[path.toString(false)].metadata)
        {
            callback(undefined, this.resources[path.toString(false)].metadata);
        }
        else
        {
            if(path.isRoot())
            {
                callback(undefined, {
                    '.tag': 'folder',
                    name: '',
                    size: 0
                })
            }
            else
            {
                this.dbx.filesGetMetadata({
                    path: this.getRemotePath(path)
                }).then((data) => {

                    if(!this.resources[path.toString(false)])
                        this.resources[path.toString(false)] = {};
                    this.resources[path.toString(false)].metadata = data;

                    callback(undefined, data);
                }).catch((e) => {
                    callback(e);
                })
            }
        }
    }

    protected dbx : Dropbox;
    protected accessKey : string;
    protected resources : any;
    protected useCache : boolean;

    constructor(accessKey) {
        super(new DropboxSerializer());

        this.accessKey = accessKey;
        this.dbx = new Dropbox({ accessToken: this.accessKey, fetch: fetch } as any);
        this.resources = {};
        this.useCache = true;
        /*
        var _this = _super.call(this, serializer ? serializer : new VirtualSerializer()) || this;
        _this.resources = {
            '/': new VirtualFileSystemResource(export_1.ResourceType.Directory)
        };*/
    }

    _rename(pathFrom, newName, ctx, callback)
    {
        this.dbx.filesMoveV2({
            from_path: this.getRemotePath(pathFrom),
            to_path: this.getRemotePath(newName),
            allow_ownership_transfer: true,
            allow_shared_folder: true
        }).then(() => {
            callback(undefined, true);
        })
        .catch((e) => {
            callback(webdav.Errors.InvalidOperation)
        });
    }

    _create(path, ctx, callback) {
        if(ctx.type.isFolder)
        {
            this.dbx.filesCreateFolderV2({
                path: this.getRemotePath(path)
            }).then(() => {
                callback();
            }).catch((e) => {
                callback();
            })
        }
        else
        {
            this.dbx.filesUpload({
                path: this.getRemotePath(path),
                contents: 'empty'
            }).then(() => {
                callback();
            }).catch((e) => {
                callback();
            })
        }
    }

    _delete(path, ctx, callback) {
        this.dbx.filesDelete({
            path: this.getRemotePath(path)
        }).then(() => {
            delete this.resources[path.toString(false)];
            callback();
        }).catch((e) => {
            callback();
        })
    };
    _openWriteStream(path, ctx, callback) {
        this.getMetaData(path, (e, data) => {
            if(e)
            {
                return callback(webdav.Errors.ResourceNotFound);
            }
                
            var content = [];
            var stream = new webdav.VirtualFileWritable(content);
            stream.on('finish', () => {
                
                this.dbx.filesUpload({
                    path: this.getRemotePath(path),
                    contents: content,
                    strict_conflict: false,
                    mode: {
                        '.tag': 'overwrite'
                    }
                }).then(() => {
                }).catch((e) => {
                })
            });
            callback(null, stream);
        })
    };
    _openReadStream(path, ctx, callback) {
        this.dbx.filesDownload({
            path: this.getRemotePath(path)
        }).then((r : any) => {
            var stream = new webdav.VirtualFileReadable([ r.fileBinary ]);
            callback(undefined, stream);
        }).catch((e) => {
            callback(webdav.Errors.ResourceNotFound);
        });
    };
    _size(path, ctx, callback) {
        this.getMetaData(path, (e, data) => {
            if(e)
                return callback(webdav.Errors.ResourceNotFound);
            
            if(!this.resources[path.toString(false)])
                this.resources[path.toString(false)] = {};
            this.resources[path.toString(false)].size = data.size;
            callback(undefined, data.size);
        })
    };
    _lockManager(path, ctx, callback) {
        this.getMetaData(path, (e) => {
            if(e)
            {
                return callback(webdav.Errors.ResourceNotFound);
            }

            if(!this.resources[path.toString(false)])
                this.resources[path.toString(false)] = {};
            if(!this.resources[path.toString(false)].locks)
                this.resources[path.toString(false)].locks = new webdav.LocalLockManager();
            callback(undefined, this.resources[path.toString(false)].locks);
        })
    };
    _propertyManager(path, ctx, callback) {
        this.getMetaData(path, (e) => {
            if(e)
                return callback(webdav.Errors.ResourceNotFound);
                
            if(!this.resources[path.toString(false)])
                this.resources[path.toString(false)] = {};
            if(!this.resources[path.toString(false)].props)
                this.resources[path.toString(false)].props = new webdav.LocalPropertyManager({});
            callback(undefined, this.resources[path.toString(false)].props);
        })
    };
    _readDir(path, ctx, callback) {
        this.dbx.filesListFolder({
            path: this.getRemotePath(path)
        }).then((data) => {
            const files = data.entries.map((entry) => entry.name);

            callback(undefined, files);
        }).catch((e) => {
            callback(webdav.Errors.ResourceNotFound)
        });
    };
    _creationDate(path, ctx, callback) {
        this._lastModifiedDate(path, ctx, callback);
    };
    _lastModifiedDate(path, ctx, callback) {
        this.getMetaData(path, (e, data) => {
            if(e)
                return callback(webdav.Errors.ResourceNotFound);
            
            callback(undefined, data.client_modified || data.server_modified);
        })
    };
    _type(path, ctx, callback) {
        if(this.useCache && this.resources[path.toString(false)] && this.resources[path.toString(false)].type)
        {
            callback(undefined, this.resources[path.toString(false)].type);
        }
        else
        {
            this.getMetaData(path, (e, data) => {
                if(e)
                    return callback(webdav.Errors.ResourceNotFound);
                
                const isFolder = data['.tag'] === 'folder';
                const type = isFolder ? webdav.ResourceType.Directory : webdav.ResourceType.File;

                if(!this.resources[path.toString(false)])
                    this.resources[path.toString(false)] = {};
                this.resources[path.toString(false)].type = type;

                callback(undefined, type);
            })
        }
    };
}
