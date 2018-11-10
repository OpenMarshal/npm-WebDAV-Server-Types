import { v2 as webdav } from 'webdav-server';
import { Dropbox } from 'dropbox';
export declare class DropboxFileSystem extends webdav.FileSystem {
    getRemotePath(path: any): any;
    getMetaData(path: any, callback: any): void;
    protected dbx: Dropbox;
    protected accessKey: string;
    protected resources: any;
    protected useCache: boolean;
    constructor(accessKey: any);
    _rename(pathFrom: any, newName: any, ctx: any, callback: any): void;
    _create(path: any, ctx: any, callback: any): void;
    _delete(path: any, ctx: any, callback: any): void;
    _openWriteStream(path: any, ctx: any, callback: any): void;
    _openReadStream(path: any, ctx: any, callback: any): void;
    _size(path: any, ctx: any, callback: any): void;
    _lockManager(path: any, ctx: any, callback: any): void;
    _propertyManager(path: any, ctx: any, callback: any): void;
    _readDir(path: any, ctx: any, callback: any): void;
    _creationDate(path: any, ctx: any, callback: any): void;
    _lastModifiedDate(path: any, ctx: any, callback: any): void;
    _type(path: any, ctx: any, callback: any): void;
}
