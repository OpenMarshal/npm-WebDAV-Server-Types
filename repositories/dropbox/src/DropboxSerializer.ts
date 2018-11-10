import { DropboxFileSystem } from './DropboxFileSystem'
import { v2 as webdav } from 'webdav-server'

export class DropboxSerializer implements webdav.FileSystemSerializer
{
    uid() {
        return 'DropboxFSSerializer-1.0.0';
    }

    serialize(fs, callback) {
        callback(null, {
            accessKey: fs.accessKey
        });
    }

    unserialize(serializedData, callback) {
        const fs = new DropboxFileSystem(serializedData.accessKey);

        callback(null, fs);
    }
}
