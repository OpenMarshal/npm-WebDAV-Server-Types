import { DeCipher, DeCipherOptions } from './DeCipher'
import { VirtualStoredFileSystem } from './VirtualStoredFileSystem'
import { VirtualStoredAllocator } from './VirtualStoredAllocator'
import { VirtualStoredResource } from './VirtualStoredResource'
import { v2 as webdav } from 'webdav-server'

export interface VirtualStoredSerializedData
{
    path : string
    resources : {
        [path : string] : VirtualStoredResource
    }
}

export class VirtualStoredSerializer implements webdav.FileSystemSerializer
{
    decipher : DeCipher

    constructor(password : string, deCipherOptions : DeCipherOptions)
    {
        this.decipher = new DeCipher(password, deCipherOptions);
    }

    uid() : string
    {
        return 'VirtualStoredSerializer-' + this.decipher.uid() + '-1.0.0';
    }

    serialize(fs : VirtualStoredFileSystem, callback : webdav.ReturnCallback<VirtualStoredSerializedData>) : void
    {
        callback(null, {
            path: fs.allocator.folderPath,
            resources: fs.resources
        });
    }

    unserialize(serializedData : VirtualStoredSerializedData, callback : webdav.ReturnCallback<VirtualStoredFileSystem>) : void
    {
        this.createNewFileSystem(serializedData.path, (e, fs) => {
            if(e)
                return callback(e);
            
            for(const path in serializedData.resources)
                fs.resources[path] = new VirtualStoredResource(serializedData.resources[path]);
            
            callback(null, fs);
        })
    }

    createNewFileSystem(path : string, callback : webdav.ReturnCallback<VirtualStoredFileSystem>) : void
    {
        const allocator = new VirtualStoredAllocator(path, this.decipher);
        allocator.initialize((e) => {
            if(e)
                return callback(e);

            const fs = new VirtualStoredFileSystem(allocator);
            fs.setSerializer(this);
            callback(null, fs);
        });
    }
}
