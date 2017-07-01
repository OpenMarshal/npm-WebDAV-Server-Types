const fs = require('fs');
      path = require('path'),
      packager = require('./packager');

fs.readdir(packager.repositoriesPath, (e, repos) => {
    if(e)
        return packager.error('Cannot list folders in ' + repositoriesPath + ' :: ' + e);
    
    const readmePath = path.join(__dirname, '..', 'README.md');
    
    fs.readFile(readmePath, (e, content) => {
        if(e)
            throw e;
        
        content = content.toString();
        let leftSize = content.indexOf('Repository | - | -');
        leftSize = content.indexOf('-|-|-', leftSize) + 1;
        leftSize = content.indexOf('\r', leftSize) + 1;
        let rightSize = content.indexOf('\r\r', leftSize);
        if(rightSize === -1)
            rightSize = content.indexOf('\n\r\n', leftSize);
        if(rightSize === -1)
            throw new Error('Cannot parse the file README.md');
            
        const left = content.substring(0, leftSize);
        const right = content.substring(rightSize);
        
        content = left + repos
            .map((name) => name + ' | [GitHub](https://github.com/OpenMarshal/npm-WebDAV-Server-Types/tree/master/repositories/' + name + ') | [npm](https://www.npmjs.com/package/@webdav-server/' + name + ')')
            .join('\n') + right;

        fs.writeFile(readmePath, content, (e) => {
            if(e)
                throw e;
            
            packager.success('README.md updated.');
        })
    })
})
