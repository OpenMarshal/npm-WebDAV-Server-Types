/// <reference types="node" />
import { Readable } from 'stream';
import { v2 as webdav } from 'webdav-server';
export declare class JavascriptFileSystem extends webdav.VirtualFileSystem {
    useEval: boolean;
    currentWorkingDirectory: string;
    constructor(useEval?: boolean, currentWorkingDirectory?: string);
    protected _openReadStream(path: webdav.Path, ctx: webdav.OpenReadStreamInfo, callback: webdav.ReturnCallback<Readable>): void;
    protected _size(path: webdav.Path, ctx: webdav.SizeInfo, callback: webdav.ReturnCallback<number>): void;
}
