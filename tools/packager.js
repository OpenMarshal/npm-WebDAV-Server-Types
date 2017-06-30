const fs = require('fs');
      path = require('path');

module.exports = {
    repositoriesPath: path.join(__dirname, '..', 'repositories'),
    success(text)
    {
        console.log(' \x1b[42m\x1b[37m\x1b[1m o \x1b[0m ' + text + '\x1b[0m');
    },
    error(text)
    {
        console.error(' \x1b[41m\x1b[37m\x1b[1m x \x1b[0m ' + text + '\x1b[0m');
    },
    action(repo)
    {
        const repoPath = path.join(module.exports.repositoriesPath, repo);
        const packagePath = path.join(repoPath, 'package.json');

        fs.readFile(packagePath, (e, npmPackage) => {
            if(e)
                return error('[' + repo + '] ' + e);
            
            npmPackage = JSON.parse(npmPackage);

            npmPackage.name = '@webdav-server/' + repo.trim();
            if(!npmPackage.dependencies)
                npmPackage.dependencies = { };
            if(!npmPackage.dependencies['webdav-server'])
                npmPackage.dependencies['webdav-server'] = '^2.0.0';
            if(!npmPackage.repository)
                npmPackage.repository = {
                    type: "git",
                    url: "https://github.com/OpenMarshal/npm-WebDAV-Server-Types.git"
                };
            
            fs.writeFile(packagePath, JSON.stringify(npmPackage, null, 2), (e) => {
                if(e)
                    return error('[' + repo + '] ' + e);
                
                module.exports.success('Updated ' + repo);
            })
        })
    }
}
