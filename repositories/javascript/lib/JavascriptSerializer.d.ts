import { JavascriptFileSystem } from './JavascriptFileSystem';
import { v2 as webdav } from 'webdav-server';
export declare class JavascriptSerializer extends webdav.VirtualSerializer {
    uid(): string;
    serialize(fs: JavascriptFileSystem, callback: webdav.ReturnCallback<any>): void;
    unserialize(serializedData: any, callback: webdav.ReturnCallback<webdav.FileSystem>): void;
}
