import { VirtualStoredAllocator } from './VirtualStoredAllocator'
import { VirtualStoredResource } from './VirtualStoredResource'
import { Readable, Writable } from 'stream'
import { v2 as webdav } from 'webdav-server'

export class VirtualStoredFileSystem extends webdav.FileSystem
{
    resources : {
        [path : string] : VirtualStoredResource
    }
    
    constructor(public allocator : VirtualStoredAllocator)
    {
        super(null);

        this.resources = {
            '/': new VirtualStoredResource(webdav.ResourceType.Directory)
        };
    }

    protected _fastExistCheck?(ctx : webdav.RequestContext, path : webdav.Path, callback : (exists : boolean) => void) : void
    {
        callback(!!this.resources[path.toString()]);
    }

    protected _create?(path : webdav.Path, ctx : webdav.CreateInfo, callback : webdav.SimpleCallback) : void
    {
        let r = this.resources[path.toString()];
        if(r)
            return callback(webdav.Errors.ResourceAlreadyExists);
        
        r = new VirtualStoredResource(ctx.type);
        const id = this.allocator.allocate();
        r.contentUID = id;
        this.resources[path.toString()] = r;
        callback();
    }
    
    protected _delete?(path : webdav.Path, ctx : webdav.DeleteInfo, callback : webdav.SimpleCallback) : void
    {
        const r = this.resources[path.toString()];
        if(!r)
            return callback(webdav.Errors.ResourceNotFound);
        
        this.allocator.free(r.contentUID);
        delete this.resources[path.toString()];
        callback();
    }

    protected _openWriteStream?(path : webdav.Path, ctx : webdav.OpenWriteStreamInfo, callback : webdav.ReturnCallback<Writable>) : void
    {
        const r = this.resources[path.toString()];
        if(!r)
            return callback(webdav.Errors.ResourceNotFound);
        
        callback(null, this.allocator.writeStream(r.contentUID))
    }
    protected _openReadStream?(path : webdav.Path, ctx : webdav.OpenReadStreamInfo, callback : webdav.ReturnCallback<Readable>) : void
    {
        const r = this.resources[path.toString()];
        if(!r)
            return callback(webdav.Errors.ResourceNotFound);
        
        callback(null, this.allocator.readStream(r.contentUID))
    }

    protected _lockManager(path : webdav.Path, ctx : webdav.LockManagerInfo, callback : webdav.ReturnCallback<webdav.ILockManager>) : void
    {
        const r = this.resources[path.toString()];
        callback(r ? null : webdav.Errors.ResourceNotFound, r ? r.lockManager : null);
    }

    protected _propertyManager(path : webdav.Path, ctx : webdav.PropertyManagerInfo, callback : webdav.ReturnCallback<webdav.IPropertyManager>) : void
    {
        const r = this.resources[path.toString()];
        callback(r ? null : webdav.Errors.ResourceNotFound, r ? r.propertyManager : null);
    }

    protected _readDir?(path : webdav.Path, ctx : webdav.ReadDirInfo, callback : webdav.ReturnCallback<string[] | webdav.Path[]>) : void
    {
        const sPath = path.toString(true);

        const paths = [];
        for(const path in this.resources)
            if(path.length > sPath.length && path.indexOf(sPath) === 0)
                paths.push(path);
        
        callback(null, paths);
    }

    protected _creationDate?(path : webdav.Path, ctx : webdav.CreationDateInfo, callback : webdav.ReturnCallback<number>) : void
    {
        const r = this.resources[path.toString()];
        callback(r ? null : webdav.Errors.ResourceNotFound, r ? r.creationDate : null);
    }

    protected _lastModifiedDate?(path : webdav.Path, ctx : webdav.LastModifiedDateInfo, callback : webdav.ReturnCallback<number>) : void
    {
        const r = this.resources[path.toString()];
        callback(r ? null : webdav.Errors.ResourceNotFound, r ? r.lastModifiedDate : null);
    }

    protected _type(path : webdav.Path, ctx : webdav.TypeInfo, callback : webdav.ReturnCallback<webdav.ResourceType>) : void
    {
        const r = this.resources[path.toString()];
        callback(r ? null : webdav.Errors.ResourceNotFound, r ? r.type : null);
    }
}
