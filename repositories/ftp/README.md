# FTP File System for webdav-server
> webdav-server version 2

## Install

```bash
npm install @webdav-server/ftp
```

## Usage

### For webdav-server

```javascript
// TypeScript
import * as ftp from '@webdav-server/ftp'
// JavaScript
const ftp = require('@webdav-server/ftp')

const server = info.startServer({
    // [...]
    autoLoad: {
        // [...]
        serializers: [
            new ftp.FTPSerializer()
            // [...]
        ]
    }
})

server.autoLoad((e) => {
    if(!e)
        return;
    
    server.setFileSystem('/myFTPGatewey', new ftp.FTPFileSystem({
        host: '127.0.0.1',
        port: 21,
        connTimeout: 1000,
        pasvTimeout: 1000,
        user: 'username',
        password: 'password'
    }));
});

server.start((s) => console.log('Ready on port', s.address().port));
```
