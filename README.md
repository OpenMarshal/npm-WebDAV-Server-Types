# List of file systems for the `webdav-server` npm package in the npm scope `@webdav-server`

This repository list some file systems which can be useful for the development of a custom implementation of the [`webdav-server` npm package](https://www.npmjs.com/package/webdav-server).

**This repository is not operational yet.** It is waiting for the release of the version 2 of the `webdav-server` package.

## Install a repository

You can install a file system package with the following command :

```bash
# Replace the {{name}} by the file system folder name
npm i @webdav-server/{{name}}
```

## List

You can find the list of the file systems here :
* [Repositories on GitHub](https://github.com/OpenMarshal/npm-WebDAV-Server-Types/tree/master/repositories)
* [Repositories on npm](https://www.npmjs.com/search?q=%40webdav-server)

## Contribute

You can contribute and publish your own file systems in the `@webdav-server` npm scope by making a simple pull-request to this GitHub repository. To do so, you must create a folder in the `repositories` folder with the name of the package. Choose a name which describe well your file system. You can make it in TypeScript or in JavaScript. You can add your own `README.md`, `LICENSE`, etc in the subfolder, but you must to add the `node_modules` folder or this kind of folders. Take a look at the existing folders in the `repositories` folder and use them as examples.

Do not hesitate to put yourself as author in the `package.json` of your new folder and to add your name in the `README.md`. When your pull-request will be accepted, the repository will be published under the scope `@webdav-server`, making your file system accessible to everyone.

Thank you for your contribution.
