import { DeCipher, DeCipherOptions } from './DeCipher';
import { VirtualStoredFileSystem } from './VirtualStoredFileSystem';
import { VirtualStoredResource } from './VirtualStoredResource';
import { v2 as webdav } from 'webdav-server';
export interface VirtualStoredSerializedData {
    path: string;
    resources: {
        [path: string]: VirtualStoredResource;
    };
}
export declare class VirtualStoredSerializer implements webdav.FileSystemSerializer {
    decipher: DeCipher;
    constructor(password: string, deCipherOptions: DeCipherOptions);
    uid(): string;
    serialize(fs: VirtualStoredFileSystem, callback: webdav.ReturnCallback<VirtualStoredSerializedData>): void;
    unserialize(serializedData: VirtualStoredSerializedData, callback: webdav.ReturnCallback<VirtualStoredFileSystem>): void;
    createNewFileSystem(path: string, callback: webdav.ReturnCallback<VirtualStoredFileSystem>): void;
}
