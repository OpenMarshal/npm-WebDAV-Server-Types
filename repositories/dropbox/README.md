# Dropbox File System for webdav-server
> webdav-server version 2

[![npm Version](https://img.shields.io/npm/v/@webdav-server/dropbox.svg)](https://www.npmjs.com/package/@webdav-server/dropbox)

Allows to see the list of files/directories from Dropbox.

## Install

```bash
npm install @webdav-server/dropbox
```

## Usage

```javascript
// TypeScript
import { v2 as webdav } from 'webdav-server'
import * as dropbox from '@webdav-server/dropbox'
// JavaScript
const webdav = require('webdav-server').v2;
const dropbox = require('@webdav-server/dropbox');

const server = new webdav.WebDAVServer({
    // [...]
    autoLoad: {
        // [...]
        serializers: [
            new dropbox.DropboxSerializer()
            // [...]
        ]
    }
})

server.setFileSystemSync('/myPath', new dropbox.DropboxFileSystem('dropboxAccessKey...'), false);

server.start((s) => console.log('Ready on port', s.address().port));
```
