const fs = require('fs');
      path = require('path'),
      packager = require('./packager');

fs.readdir(packager.repositoriesPath, (e, repos) => {
    if(e)
        return packager.error('Cannot list folders in ' + repositoriesPath + ' :: ' + e);
        
    repos.forEach((repo) => {
        packager.action(repo);
    })
})
