/// <reference types="node" />
import { VirtualStoredAllocator } from './VirtualStoredAllocator';
import { VirtualStoredResource } from './VirtualStoredResource';
import { Readable, Writable } from 'stream';
import { v2 as webdav } from 'webdav-server';
export declare class VirtualStoredFileSystem extends webdav.FileSystem {
    allocator: VirtualStoredAllocator;
    resources: {
        [path: string]: VirtualStoredResource;
    };
    constructor(allocator: VirtualStoredAllocator);
    protected _fastExistCheck?(ctx: webdav.RequestContext, path: webdav.Path, callback: (exists: boolean) => void): void;
    protected _create?(path: webdav.Path, ctx: webdav.CreateInfo, callback: webdav.SimpleCallback): void;
    protected _delete?(path: webdav.Path, ctx: webdav.DeleteInfo, callback: webdav.SimpleCallback): void;
    protected _openWriteStream?(path: webdav.Path, ctx: webdav.OpenWriteStreamInfo, callback: webdav.ReturnCallback<Writable>): void;
    protected _openReadStream?(path: webdav.Path, ctx: webdav.OpenReadStreamInfo, callback: webdav.ReturnCallback<Readable>): void;
    protected _lockManager(path: webdav.Path, ctx: webdav.LockManagerInfo, callback: webdav.ReturnCallback<webdav.ILockManager>): void;
    protected _propertyManager(path: webdav.Path, ctx: webdav.PropertyManagerInfo, callback: webdav.ReturnCallback<webdav.IPropertyManager>): void;
    protected _readDir?(path: webdav.Path, ctx: webdav.ReadDirInfo, callback: webdav.ReturnCallback<string[] | webdav.Path[]>): void;
    protected _creationDate?(path: webdav.Path, ctx: webdav.CreationDateInfo, callback: webdav.ReturnCallback<number>): void;
    protected _lastModifiedDate?(path: webdav.Path, ctx: webdav.LastModifiedDateInfo, callback: webdav.ReturnCallback<number>): void;
    protected _type(path: webdav.Path, ctx: webdav.TypeInfo, callback: webdav.ReturnCallback<webdav.ResourceType>): void;
}
