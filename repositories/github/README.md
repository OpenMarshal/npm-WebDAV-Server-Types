# GitHub File System for webdav-server
> webdav-server version 2

[![npm Version](https://img.shields.io/npm/v/@webdav-server/github.svg)](https://www.npmjs.com/package/@webdav-server/github)

Allow to see the list of files/directories in a GitHub repository. It is read-only.

## Install

```bash
npm install @webdav-server/github
```

## Usage

```javascript
// TypeScript
import { v2 as webdav } from 'webdav-server'
import * as github from '@webdav-server/github'
// JavaScript
const webdav = require('webdav-server').v2;
const github = require('@webdav-server/github');

const server = new webdav.WebDAVServer({
    // [...]
    autoLoad: {
        // [...]
        serializers: [
            new github.GitHubSerializer()
            // [...]
        ]
    }
})

// for client_id and client_secret, refer to https://developer.github.com/v3/oauth_authorizations/
server.setFileSystemSync('/myPath', new github.GitHubFileSystem('openmarshal', 'npm-WebDAV-Server', 'client_id...', 'client_secret...'), false);

server.start((s) => console.log('Ready on port', s.address().port));
```
