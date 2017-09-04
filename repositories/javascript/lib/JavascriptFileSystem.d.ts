/// <reference types="node" />
import { Readable } from 'stream';
import { v2 as webdav } from 'webdav-server';
export interface JavascriptFileSystemOptions {
    useEval: boolean;
    currentWorkingDirectory?: string;
    disableSourceReading?: boolean;
}
export declare class JavascriptFileSystem extends webdav.VirtualFileSystem {
    options: JavascriptFileSystemOptions;
    constructor(options: JavascriptFileSystemOptions);
    protected _openReadStream(path: webdav.Path, ctx: webdav.OpenReadStreamInfo, callback: webdav.ReturnCallback<Readable>): void;
    protected _size(path: webdav.Path, ctx: webdav.SizeInfo, callback: webdav.ReturnCallback<number>): void;
}
