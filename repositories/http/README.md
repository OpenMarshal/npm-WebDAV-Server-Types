# HTTP File System for webdav-server
> webdav-server version 2

[![npm Version](https://img.shields.io/npm/v/@webdav-server/http.svg)](https://www.npmjs.com/package/@webdav-server/http)

Allow to get content from a web resource.

## Install

```bash
npm install @webdav-server/ftp
```

## Usage

```javascript
// TypeScript
import { v2 as webdav } from 'webdav-server'
import * as request from 'request'
import * as http from '@webdav-server/http'
// JavaScript
const http = require('@webdav-server/http');
const webdav = require('webdav-server').v2;
const request = require('request');

const server = new webdav.HTTPDAVServer({
    // [...]
    autoLoad: {
        // [...]
        serializers: [
            new http.HTTPFileSystemSerializer()
            // [...]
        ]
    }
})

server.autoLoad((e) => {
    if(!e)
        return;
    
    server.setFileSystem('/myWebGateway', new http.HTTPFileSystem('https://opensource.org/licenses'), () => {
        server.start((s) => {
            console.log('Ready on port', s.address().port);
            
            request('http://127.0.0.1:' + s.address().port + '/myWebGateway/', (e, res, body) => {
                if(e)
                    return console.error(e);

                // [...]
            })
            
            request('http://127.0.0.1:' + s.address().port + '/myWebGateway/BSD-3-Clause', (e, res, body) => {
                if(e)
                    return console.error(e);

                // [...]
            })
        });
    });
});
```
