/// <reference types="node" />
import { Readable, Writable } from 'stream';
import { v2 as webdav } from 'webdav-server';
import { DeCipher } from './DeCipher';
export declare class VirtualStoredAllocator {
    folderPath: string;
    deCipher: DeCipher;
    currentUID: number;
    constructor(folderPath: string, deCipher: DeCipher);
    initialize(callback: webdav.SimpleCallback): void;
    allocate(): string;
    free(name: string): void;
    fullPath(name: string): string;
    readStream(name: string): Readable;
    writeStream(name: string): Writable;
}
