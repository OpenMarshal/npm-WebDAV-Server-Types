const fs = require('fs');
      path = require('path');

function success(text)
{
    successes.push(' \x1b[42m\x1b[37m\x1b[1m o \x1b[0m ' + text + '\x1b[0m');
}
function error(text)
{
    errors.push(' \x1b[41m\x1b[37m\x1b[1m x \x1b[0m ' + text + '\x1b[0m');
}

const repositoriesPath = path.join(__dirname, 'repositories');
fs.readdir(repositoriesPath, (e, repos) => {
    if(e)
        return error('Cannot list folders in ' + repositoriesPath + ' :: ' + e);
        
    repos.forEach((repo) => {
        const repoPath = path.join(repositoriesPath, repo)
        const packagePath = path.join(repoPath, 'package.json');

        fs.readFile(packagePath, (e, npmPackage) => {
            if(e)
                return error('[' + repo + '] ' + e);

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
            
            fs.writeFile(packagePath, JSON.stringify(npmPackage), (e) => {
                if(e)
                    return error('[' + repo + '] ' + e);
                
                success('Updated ' + repo);
            })
        })
    })
})
