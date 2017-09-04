# Javascript File System for webdav-server
> webdav-server version 2

[![npm Version](https://img.shields.io/npm/v/@webdav-server/javascript.svg)](https://www.npmjs.com/package/@webdav-server/javascript)

Allow to execute javascript. The source of the file is the javascript code, but the translated content is the result of the execution of the source code.

The file can be executed in two modes : eval mode and exec mode.

The eval mode will execute the source code with an `eval(...)`, allowing the code to be executed within the server context.
The exec mode will execute the source code in a new `node` processus.

## Install

```bash
npm install @webdav-server/javascript
```

## Options

Name | Type | Optional | Description
-|-|-
useEval | boolean | false | 
currentWorkingDirectory | string | true | 
disableSourceReading | boolean | true | 

## Usage

```javascript
// TypeScript
import { v2 as webdav } from 'webdav-server'
import * as js from '@webdav-server/javascript'
// JavaScript
const webdav = require('webdav-server').v2;
const js = require('@webdav-server/javascript');

const server = new webdav.WebDAVServer({
    // [...]
    autoLoad: {
        // [...]
        serializers: [
            new js.JavascriptSerializer()
            // [...]
        ]
    }
})

const jsFileSystemEval = new js.JavascriptFileSystem({
    useEval: true
});
const jsFileSystemExec = new js.JavascriptFileSystem({
    useEval: false
});

server.setFileSystemSync('/eval', jsFileSystemEval, false);
server.setFileSystemSync('/exec', jsFileSystemExec, false);

jsFileSystemEval.openWriteStream(server.createExternalContext(), '/file1.txt', 'mustCreate', (e, wStream) => {
    if(e) throw e;
    wStream.end('return "Helloooooooooooooooooooooooooooooooo file 1!";');
})
jsFileSystemEval.openWriteStream(server.createExternalContext(), '/file2.txt', 'mustCreate', (e, wStream) => {
    if(e) throw e;
    wStream.end('systemCallback("Helloooooooooooooooooooooooooooooooo file 2!");');
})
jsFileSystemEval.openWriteStream(server.createExternalContext(), '/npm-WebDAV-Server.html', 'mustCreate', (e, wStream) => {
    if(e) throw e;
    wStream.end(
        "const request = require('request'); \
            \
        request({ \
            url: 'https://github.com/OpenMarshal/npm-WebDAV-Server' \
        }, (e, res, body) => { \
            systemCallback(body); \
        })"
    );
})
jsFileSystemExec.openWriteStream(server.createExternalContext(), '/file.txt', 'mustCreate', (e, wStream) => {
    if(e) throw e;
    wStream.end('console.log("Helloooooooooooooooooooooooooooooooo file exec!");');
})

server.beforeRequest((ctx, next) => {
    console.log(ctx.request.method, ctx.request.url);
    next();
})
server.afterRequest((ctx, next) => {
    console.log(ctx.request.method, ctx.request.url, ctx.response.statusCode, ctx.response.statusMessage);
    next();
})

server.start((s) => console.log('Ready on port', s.address().port));
```
