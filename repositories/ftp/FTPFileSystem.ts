import { v2 as webdav } from 'webdav-server'
import { Readable, Writable, Transform } from 'stream'
import * as Client from 'ftp'

export class _FTPFileSystemResource
{
    props : webdav.LocalPropertyManager
    locks : webdav.LocalLockManager
    type : webdav.ResourceType

    constructor(data ?: _FTPFileSystemResource)
    {
        if(!data)
        {
            this.props = new webdav.LocalPropertyManager();
            this.locks = new webdav.LocalLockManager();
        }
        else
        {
            const rs = data as _FTPFileSystemResource;
            this.props = rs.props;
            this.locks = rs.locks;
        }
    }
}

export class FTPSerializer implements webdav.FileSystemSerializer
{
    uid() : string
    {
        return 'FTPFSSerializer_1.0.0';
    }

    serialize(fs : FTPFileSystem, callback : webdav.ReturnCallback<any>) : void
    {
        callback(null, {
            resources: fs.resources,
            config: fs.config
        });
    }

    unserialize(serializedData : any, callback : webdav.ReturnCallback<webdav.FileSystem>) : void
    {
        const fs = new FTPFileSystem(serializedData.config);
        fs.resources = serializedData.resources;
        callback(null, fs);
    }
}

export class FTPFileSystem extends webdav.FileSystem
{
    resources : {
        [path : string] : _FTPFileSystemResource
    }

    constructor(public config : Client.Options)
    {
        super(new FTPSerializer());

        this.resources = {
            '/': new _FTPFileSystemResource()
        };
    }

    protected getRealPath(path : webdav.Path)
    {
        const sPath = path.toString();

        return {
            realPath: sPath,
            resource: this.resources[sPath]
        };
    }
    
    protected connect(callback : (client : Client) => void)
    {
        const client = new Client();
        client.on('ready', () => callback(client));
        client.connect(this.config);
    }

    protected _create(path : webdav.Path, ctx : webdav.CreateInfo, _callback : webdav.SimpleCallback) : void
    {
        if(path.isRoot())
            return _callback(webdav.Errors.InvalidOperation);

        const { realPath } = this.getRealPath(path);

        this.connect((c) => {
            const callback = (e) => {
                if(!e)
                    this.resources[path.toString()] = new _FTPFileSystemResource();
                else if(e)
                    e = webdav.Errors.ResourceAlreadyExists;
                
                c.end();
                _callback(e);
            }

            if(ctx.type.isDirectory)
                c.mkdir(realPath, callback);
            else
            {
                this._openWriteStream(path, {
                    context: ctx.context,
                    estimatedSize: 0,
                    mode: null,
                    targetSource: true
                }, (e, wStream) => {
                    if(e)
                        return callback(e);
                    
                    wStream.end(new Buffer(0), callback)
                })
            }
        })
    }

    protected _delete(path : webdav.Path, ctx : webdav.DeleteInfo, _callback : webdav.SimpleCallback) : void
    {
        if(path.isRoot())
            return _callback(webdav.Errors.InvalidOperation);

        const { realPath } = this.getRealPath(path);

        this.connect((c) => {
            const callback = (e) => {
                if(!e)
                    delete this.resources[path.toString()];

                c.end();
                _callback(e);
            }

            this.type(ctx.context, path, (e, type) => {
                if(e)
                    return callback(webdav.Errors.ResourceNotFound);
                
                if(type.isDirectory)
                    c.rmdir(realPath, callback);
                else
                    c.delete(realPath, callback);
            })
        })
    }

    protected _openWriteStream(path : webdav.Path, ctx : webdav.OpenWriteStreamInfo, callback : webdav.ReturnCallback<Writable>) : void
    {
        if(path.isRoot())
            return callback(webdav.Errors.InvalidOperation);

        const { realPath, resource } = this.getRealPath(path);

        this.connect((c) => {
            const wStream = new Transform({
                transform(chunk, encoding, cb)
                {
                    cb(null, chunk);
                }
            });
            c.put(wStream, realPath, (e) => {
                c.end();
            });
            callback(null, wStream);
        })
    }

    protected _openReadStream(path : webdav.Path, ctx : webdav.OpenReadStreamInfo, callback : webdav.ReturnCallback<Readable>) : void
    {
        if(path.isRoot())
            return callback(webdav.Errors.InvalidOperation);

        const { realPath } = this.getRealPath(path);

        this.connect((c) => {
            c.get(realPath, (e, rStream) => {
                if(e)
                    return callback(webdav.Errors.ResourceNotFound, null);
                
                const stream = new Transform({
                    transform(chunk, encoding, cb)
                    {
                        cb(null, chunk);
                    }
                });
                stream.on('error', () => {
                    c.end();
                })
                stream.on('finish', () => {
                    c.end();
                })
                rStream.pipe(stream);
                callback(null, stream);
            });
        })
    }

    protected _size(path : webdav.Path, ctx : webdav.SizeInfo, callback : webdav.ReturnCallback<number>) : void
    {
        if(path.isRoot())
            return callback(webdav.Errors.InvalidOperation);

        const { realPath } = this.getRealPath(path);

        this.connect((c) => {
            c.size(realPath, (e, size) => {
                c.end();
                
                callback(e ? webdav.Errors.ResourceNotFound : null, size);
            })
        })
    }

    protected _lockManager(path : webdav.Path, ctx : webdav.LockManagerInfo, callback : webdav.ReturnCallback<webdav.ILockManager>) : void
    {
        let resource = this.resources[path.toString()];
        if(!resource)
        {
            resource = new _FTPFileSystemResource();
            this.resources[path.toString()] = resource;
        }

        callback(null, resource.locks);
    }

    protected _propertyManager(path : webdav.Path, ctx : webdav.PropertyManagerInfo, callback : webdav.ReturnCallback<webdav.IPropertyManager>) : void
    {
        let resource = this.resources[path.toString()];
        if(!resource)
        {
            resource = new _FTPFileSystemResource();
            this.resources[path.toString()] = resource;
        }

        callback(null, resource.props);
    }

    protected _readDir(path : webdav.Path, ctx : webdav.ReadDirInfo, callback : webdav.ReturnCallback<string[] | webdav.Path[]>) : void
    {
        const { realPath } = this.getRealPath(path);

        this.connect((c) => {
            c.list(realPath, (e, list) => {
                c.end();
                
                if(e)
                    return callback(webdav.Errors.ResourceNotFound);
                
                callback(null, list.map((el) => el.name));
            })
        });
    }

    protected _creationDate(path : webdav.Path, ctx : webdav.CreationDateInfo, callback : webdav.ReturnCallback<number>) : void
    {
        this._lastModifiedDate(path, {
            context: ctx.context
        }, callback);
    }

    protected _lastModifiedDate(path : webdav.Path, ctx : webdav.LastModifiedDateInfo, callback : webdav.ReturnCallback<number>) : void
    {
        if(path.isRoot())
            return callback(null, 0);

        const { realPath } = this.getRealPath(path);

        this.connect((c) => {
            c.lastMod(realPath, (e, date) => {
                c.end();
                callback(e ? webdav.Errors.ResourceNotFound : null, !date ? 0 : date.valueOf());
            })
        })
    }

    protected _type(path : webdav.Path, ctx : webdav.TypeInfo, callback : webdav.ReturnCallback<webdav.ResourceType>) : void
    {
        if(path.isRoot())
            return callback(null, webdav.ResourceType.Directory);
        
        const { realPath } = this.getRealPath(path.getParent());

        this.connect((c) => {
            c.list(realPath, (e, list) => {
                c.end();

                if(e)
                    return callback(webdav.Errors.ResourceNotFound);
                
                for(const element of list)
                    if(element.name === path.fileName())
                        return callback(null, element.type === '-' ? webdav.ResourceType.File : webdav.ResourceType.Directory);

                callback(webdav.Errors.ResourceNotFound);
            })
        })
    }
}
