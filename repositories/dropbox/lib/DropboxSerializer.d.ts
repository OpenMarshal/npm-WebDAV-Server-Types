import { v2 as webdav } from 'webdav-server';
export declare class DropboxSerializer implements webdav.FileSystemSerializer {
    uid(): string;
    serialize(fs: any, callback: any): void;
    unserialize(serializedData: any, callback: any): void;
}
