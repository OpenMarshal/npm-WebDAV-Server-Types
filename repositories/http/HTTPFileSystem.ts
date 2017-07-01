import { v2 as webdav } from 'webdav-server'
import { Readable, Writable, Transform } from 'stream'
import * as request from 'request'

export class Resource
{
    props : webdav.IPropertyManager;
    locks : webdav.ILockManager;

    constructor(data ?: Resource)
    {
        this.props = new webdav.LocalPropertyManager(data ? data.props : undefined);
        this.locks = new webdav.LocalLockManager();
    }
}

// Serializer
export class HTTPFileSystemSerializer implements webdav.FileSystemSerializer
{
    uid() : string
    {
        return "HTTPFileSystemSerializer_1.0.0";
    }

    serialize(fs : HTTPFileSystem, callback : webdav.ReturnCallback<any>) : void
    {
        callback(null, {
            url: fs.url,
            resources: fs.resources
        });
    }

    unserialize(serializedData : any, callback : webdav.ReturnCallback<HTTPFileSystem>) : void
    {
        const fs = new HTTPFileSystem(serializedData.url);
        for(const path of serializedData.resources)
            serializedData[path] = new Resource(serializedData.resources[path]);
        callback(null, fs);
    }
}

// File system
export class HTTPFileSystem extends webdav.FileSystem
{
    resources : {
        [path : string] : Resource
    }
    url : string

    constructor(url : string)
    {
        super(new HTTPFileSystemSerializer());

        if(!url)
            url = '';
        if(url.lastIndexOf('/') === url.length - 1)
            url = url.substring(0, url.length - 1);

        this.resources = {};
        this.url = url;
    }

    protected findResource(path : webdav.Path)
    {
        const sPath = path.toString();
        const r = this.resources[sPath];
        if(!r)
            return this.resources[sPath] = new Resource();
        return r;
    }

    _openReadStream(path : webdav.Path, info : webdav.OpenReadStreamInfo, callback : webdav.ReturnCallback<Readable>) : void
    {
        const stream = request(this.url + path.toString());
        callback(null, (stream as any) as Readable);
    }

    _openWriteStream(path : webdav.Path, info : webdav.OpenWriteStreamInfo, callback : webdav.ReturnCallback<Writable>) : void
    {
        const stream = request.put(this.url + path.toString());
        callback(null, (stream as any) as Writable);
    }

    _propertyManager(path : webdav.Path, info : webdav.PropertyManagerInfo, callback : webdav.ReturnCallback<webdav.IPropertyManager>) : void
    {
        callback(null, this.findResource(path).props);
    }

    _lockManager(path : webdav.Path, info : webdav.LockManagerInfo, callback : webdav.ReturnCallback<webdav.ILockManager>) : void
    {
        callback(null, this.findResource(path).locks);
    }

    _size(path : webdav.Path, info : webdav.SizeInfo, callback : webdav.ReturnCallback<number>) : void
    {
        request({
            url: this.url + path.toString(),
            method: 'HEAD'
        }, (e, res) => {
            if(e)
                return callback(e);
            
            const contentLength = res.headers['content-length'];
            console.log(res.headers);
            console.log(contentLength);
            if(contentLength)
                callback(null, parseInt(contentLength.constructor === String ? contentLength as string : contentLength[0]));
            else
                callback(null, undefined);
        })
    }

    _mimeType(path : webdav.Path, info : webdav.MimeTypeInfo, callback : webdav.ReturnCallback<string>) : void
    {
        request({
            url: this.url + path.toString(),
            method: 'HEAD'
        }, (e, res) => {
            if(e)
                return callback(e);
            
            const contentType = res.headers['content-type'];
            if(contentType)
                callback(null, contentType.constructor === String ? contentType as string : contentType[0]);
            else
                callback(null, 'application/octet-stream');
        })
    }

    _type(path : webdav.Path, info : webdav.TypeInfo, callback : webdav.ReturnCallback<webdav.ResourceType>) : void
    {
        callback(null, webdav.ResourceType.File);
    }
}
