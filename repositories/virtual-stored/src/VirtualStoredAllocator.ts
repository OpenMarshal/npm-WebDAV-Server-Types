import { Readable, Writable } from 'stream'
import { v2 as webdav } from 'webdav-server'
import { DeCipher } from './DeCipher'
import * as path from 'path'
import * as fs from 'fs'

export class VirtualStoredAllocator
{
    currentUID : number

    constructor(public folderPath : string, public deCipher : DeCipher)
    {
        this.currentUID = 0;
    }

    initialize(callback : webdav.SimpleCallback) : void
    {
        fs.readdir(this.folderPath, (e, files) => {
            if(e)
                return callback(e);
            
            files.forEach((file) => {
                const id = parseInt(file);
                if(!isNaN(id) && this.currentUID < id)
                    this.currentUID = id;
            })

            callback();
        })
    }

    allocate() : string
    {
        return (++this.currentUID).toString(16);
    }

    free(name : string) : void
    {
        fs.unlink(this.fullPath(name));
    }

    fullPath(name : string) : string
    {
        return path.join(this.folderPath, name);
    }

    readStream(name : string) : Readable
    {
        const cipher = this.deCipher.newDecipher(name);
        return fs.createReadStream(this.fullPath(name)).pipe(cipher) as any;
    }

    writeStream(name : string) : Writable
    {
        const cipher = this.deCipher.newCipher(name);
        cipher.pipe(fs.createWriteStream(this.fullPath(name)));
        return cipher as any;
    }
}
