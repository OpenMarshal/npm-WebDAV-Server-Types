# Virtual Stored File System for webdav-server
> webdav-server version 2

[![npm Version](https://img.shields.io/npm/v/@webdav-server/virtual-stored.svg)](https://www.npmjs.com/package/@webdav-server/virtual-stored)

Allow to keep virtual the resource tree while storing the content of the files in files of a folder. It encrypts the content of the files.

It is more suited for large contents than the `VirtualFileSystem`.

## Install

```bash
npm install @webdav-server/virtual-stored
```

## Usage

```javascript
// TypeScript
import { v2 as webdav } from 'webdav-server'
import * as virtualStored from '@webdav-server/virtual-stored'
// JavaScript
const webdav = require('webdav-server').v2;
const virtualStored = require('@webdav-server/virtual-stored');

const serializer = new virtualStored.VirtualStoredSerializer('password', {
    salt: 'this is the salt of the world',
    cipher: 'aes-256-cbc',
    cipherIvSize: 16,
    hash: 'sha256',
    masterNbIteration: 80000,
    minorNbIteration: 1000,
    keyLen: 256
});

const server = new webdav.WebDAVServer({
    // [...]
    autoLoad: {
        // [...]
        serializers: [
            serializer
            // [...]
        ]
    }
})

const vsfsPath = path.resolve('./data');
fs.mkdir(vsfsPath, (e) => {
    if(e)
        throw e;
    
    serializer.createNewFileSystem(vsfsPath, (e, vsfs) => {
        if(e)
            throw e;
        
        server.setFileSystemSync('/myPath', vsfs, false);
    })
})

server.start((s) => console.log('Ready on port', s.address().port));
```
