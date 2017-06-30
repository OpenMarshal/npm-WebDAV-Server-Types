/// <reference types="ftp" />
/// <reference types="node" />
import { v2 as webdav } from 'webdav-server';
import { Readable, Writable } from 'stream';
import * as Client from 'ftp';
export declare class _FTPFileSystemResource {
    props: webdav.LocalPropertyManager;
    locks: webdav.LocalLockManager;
    type: webdav.ResourceType;
    constructor(data?: _FTPFileSystemResource);
}
export declare class FTPSerializer implements webdav.FileSystemSerializer {
    uid(): string;
    serialize(fs: FTPFileSystem, callback: webdav.ReturnCallback<any>): void;
    unserialize(serializedData: any, callback: webdav.ReturnCallback<webdav.FileSystem>): void;
}
export declare class FTPFileSystem extends webdav.FileSystem {
    config: Client.Options;
    resources: {
        [path: string]: _FTPFileSystemResource;
    };
    constructor(config: Client.Options);
    protected getRealPath(path: webdav.Path): {
        realPath: string;
        resource: _FTPFileSystemResource;
    };
    protected connect(callback: (client: Client) => void): void;
    protected _create(path: webdav.Path, ctx: webdav.CreateInfo, _callback: webdav.SimpleCallback): void;
    protected _delete(path: webdav.Path, ctx: webdav.DeleteInfo, _callback: webdav.SimpleCallback): void;
    protected _openWriteStream(path: webdav.Path, ctx: webdav.OpenWriteStreamInfo, callback: webdav.ReturnCallback<Writable>): void;
    protected _openReadStream(path: webdav.Path, ctx: webdav.OpenReadStreamInfo, callback: webdav.ReturnCallback<Readable>): void;
    protected _size(path: webdav.Path, ctx: webdav.SizeInfo, callback: webdav.ReturnCallback<number>): void;
    protected _lockManager(path: webdav.Path, ctx: webdav.LockManagerInfo, callback: webdav.ReturnCallback<webdav.ILockManager>): void;
    protected _propertyManager(path: webdav.Path, ctx: webdav.PropertyManagerInfo, callback: webdav.ReturnCallback<webdav.IPropertyManager>): void;
    protected _readDir(path: webdav.Path, ctx: webdav.ReadDirInfo, callback: webdav.ReturnCallback<string[] | webdav.Path[]>): void;
    protected _creationDate(path: webdav.Path, ctx: webdav.CreationDateInfo, callback: webdav.ReturnCallback<number>): void;
    protected _lastModifiedDate(path: webdav.Path, ctx: webdav.LastModifiedDateInfo, callback: webdav.ReturnCallback<number>): void;
    protected _type(path: webdav.Path, ctx: webdav.TypeInfo, callback: webdav.ReturnCallback<webdav.ResourceType>): void;
}
