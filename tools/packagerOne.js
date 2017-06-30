const fs = require('fs');
      path = require('path'),
      packager = require('./packager');

if(process.argv.length <= 2)
    return console.error('Usage : node packagerOne.js <repo-name...>');

for(let i = 2; i < process.argv.length; ++i)
    packager.action(process.argv[i]);
