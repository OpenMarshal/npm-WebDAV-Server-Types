/// <reference types="node" />
import { v2 as webdav } from '../../../npm-WebDAV-Server/lib/index';
import { Readable, Writable } from 'stream';
export declare class Resource {
    props: webdav.IPropertyManager;
    locks: webdav.ILockManager;
    constructor(data?: Resource);
}
export declare class WebFileSystemSerializer implements webdav.FileSystemSerializer {
    uid(): string;
    serialize(fs: WebFileSystem, callback: webdav.ReturnCallback<any>): void;
    unserialize(serializedData: any, callback: webdav.ReturnCallback<WebFileSystem>): void;
}
export declare class WebFileSystem extends webdav.FileSystem {
    resources: {
        [path: string]: Resource;
    };
    url: string;
    constructor(url: string);
    protected findResource(path: webdav.Path): Resource;
    _openReadStream(path: webdav.Path, info: webdav.OpenReadStreamInfo, callback: webdav.ReturnCallback<Readable>): void;
    _openWriteStream(path: webdav.Path, info: webdav.OpenWriteStreamInfo, callback: webdav.ReturnCallback<Writable>): void;
    _propertyManager(path: webdav.Path, info: webdav.PropertyManagerInfo, callback: webdav.ReturnCallback<webdav.IPropertyManager>): void;
    _lockManager(path: webdav.Path, info: webdav.LockManagerInfo, callback: webdav.ReturnCallback<webdav.ILockManager>): void;
    _size(path: webdav.Path, info: webdav.SizeInfo, callback: webdav.ReturnCallback<number>): void;
    _mimeType(path: webdav.Path, info: webdav.MimeTypeInfo, callback: webdav.ReturnCallback<string>): void;
    _type(path: webdav.Path, info: webdav.TypeInfo, callback: webdav.ReturnCallback<webdav.ResourceType>): void;
}
