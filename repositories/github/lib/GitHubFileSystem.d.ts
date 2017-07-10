/// <reference types="node" />
import { Readable } from 'stream';
import { v2 as webdav } from 'webdav-server';
export interface GitHubAPIResource {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: 'file' | 'dir';
    _links: {
        self: string;
        git: string;
        html: string;
    };
}
export declare class GitHubFileSystem extends webdav.FileSystem {
    organisation: string;
    repository: string;
    client_id: string;
    client_secret: string;
    properties: {
        [path: string]: webdav.LocalPropertyManager;
    };
    base: string;
    cache: {
        [url: string]: {
            error: Error;
            body: any;
            date: number;
        };
    };
    constructor(organisation: string, repository: string, client_id: string, client_secret: string);
    protected _parse(subPath: webdav.Path, callback: webdav.ReturnCallback<GitHubAPIResource[] | GitHubAPIResource>): void;
    protected _openReadStream?(path: webdav.Path, ctx: webdav.OpenReadStreamInfo, callback: webdav.ReturnCallback<Readable>): void;
    protected _lockManager(path: webdav.Path, ctx: webdav.LockManagerInfo, callback: webdav.ReturnCallback<webdav.ILockManager>): void;
    protected _propertyManager(path: webdav.Path, ctx: webdav.PropertyManagerInfo, callback: webdav.ReturnCallback<webdav.IPropertyManager>): void;
    protected _readDir(path: webdav.Path, ctx: webdav.ReadDirInfo, callback: webdav.ReturnCallback<string[] | webdav.Path[]>): void;
    protected _size(path: webdav.Path, ctx: webdav.SizeInfo, callback: webdav.ReturnCallback<number>): void;
    protected _type(path: webdav.Path, ctx: webdav.TypeInfo, callback: webdav.ReturnCallback<webdav.ResourceType>): void;
}
