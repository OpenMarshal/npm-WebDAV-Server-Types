/// <reference types="node" />
import * as crypto from 'crypto';
export interface DeCipherOptions {
    masterNbIteration: number;
    minorNbIteration: number;
    cipherIvSize: number;
    keyLen: number;
    cipher: string;
    hash: string;
    salt: string | Buffer;
}
export declare class DeCipher {
    config: DeCipherOptions;
    master: Buffer;
    key: Buffer;
    sUid: string;
    constructor(password: string, config: DeCipherOptions);
    uid(): string;
    buildIV(seed: any): Buffer;
    newCipher(seed: any): crypto.Cipher;
    newDecipher(seed: any): crypto.Decipher;
}
