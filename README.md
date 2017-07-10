# List of file systems for the `webdav-server` npm package in the npm scope `@webdav-server`

[![Join the chat at https://gitter.im/npm-WebDAV-Server/Lobby](https://badges.gitter.im/npm-WebDAV-Server/Lobby.svg)](https://gitter.im/npm-WebDAV-Server/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Join the chat at https://gitter.im/npm-WebDAV-Server/help-v2](https://img.shields.io/badge/chat-help%20v2-blue.svg)](https://gitter.im/npm-WebDAV-Server/help-v2?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Join the chat at https://gitter.im/npm-WebDAV-Server/help-v1](https://img.shields.io/badge/chat-help%20v1-blue.svg)](https://gitter.im/npm-WebDAV-Server/help-v1?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Join the chat at https://gitter.im/npm-WebDAV-Server/file-systems](https://img.shields.io/badge/chat-%40webdav--server-blue.svg)](https://gitter.im/npm-WebDAV-Server/file-systems?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repository list some file systems which can be useful for the development of a custom implementation of the [`webdav-server` npm package](https://www.npmjs.com/package/webdav-server).

**This repository is not operational yet.** It is waiting for the release of the version 2 of the `webdav-server` package.

## Install a repository

You can install a file system package with the following command :

```bash
# Replace the {{name}} by the file system folder name
npm i @webdav-server/{{name}}
```

## List

You can find the list of the repositories here :

Repository | - | -
-|-|-ftp | [:octocat:](https://github.com/OpenMarshal/npm-WebDAV-Server-Types/tree/master/repositories/ftp) | [![npm Version](https://img.shields.io/npm/v/@webdav-server/ftp.svg)](https://www.npmjs.com/package/@webdav-server/ftp)
github | [:octocat:](https://github.com/OpenMarshal/npm-WebDAV-Server-Types/tree/master/repositories/github) | [![npm Version](https://img.shields.io/npm/v/@webdav-server/github.svg)](https://www.npmjs.com/package/@webdav-server/github)
http | [:octocat:](https://github.com/OpenMarshal/npm-WebDAV-Server-Types/tree/master/repositories/http) | [![npm Version](https://img.shields.io/npm/v/@webdav-server/http.svg)](https://www.npmjs.com/package/@webdav-server/http)
virtual-stored | [:octocat:](https://github.com/OpenMarshal/npm-WebDAV-Server-Types/tree/master/repositories/virtual-stored) | [![npm Version](https://img.shields.io/npm/v/@webdav-server/virtual-stored.svg)](https://www.npmjs.com/package/@webdav-server/virtual-stored)

Or make your own research here :
* [Repositories on GitHub](https://github.com/OpenMarshal/npm-WebDAV-Server-Types/tree/master/repositories)
* [Repositories on npm](https://www.npmjs.com/search?q=%40webdav-server)

## Contribute

You can contribute and publish your own file systems in the `@webdav-server` npm scope by making a simple pull-request to this GitHub repository. To do so, you must create a folder in the `repositories` folder with the name of the package. Choose a name which describe well your file system. You can make it in TypeScript or in JavaScript. You can add your own `README.md`, `LICENSE`, etc in the subfolder, but you must to add the `node_modules` folder or this kind of folders. Take a look at the existing folders in the `repositories` folder and use them as examples.

Do not hesitate to put yourself as author in the `package.json` of your new folder and to add your name in the `README.md`. When your pull-request will be accepted, the repository will be published under the scope `@webdav-server`, making your file system accessible to everyone.

Here is the list of operations :
1. Fork the project.
2. Clone your forked project on your machine.
3. Add a folder in the `/repositories` folder of the cloned project. The name of this new folder must be the one to use to publish your repository into `@webdav-server`.
4. In this new folder, write your code, add a `package.json`, a `README.md`, a `LICENSE`, a `tsconfig.json` if you use TypeScript.
5. When you checked that your creation is working well, commit your changes.
6. Push your changes to your remote repository.
7. Make a pull-request to the original repository, in order to add your creation to the repositories.
8. Then, if your pull-request is accepted, it will be published on npm.
9. If you make any change, you can make a new pull-request to update the repository.

Thank you for your contribution.
