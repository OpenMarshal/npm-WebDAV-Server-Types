import { GitHubFileSystem } from './GitHubFileSystem';
import { v2 as webdav } from 'webdav-server';
export interface GitHubSerializedData {
    organisation: string;
    repository: string;
    properties: {
        [path: string]: webdav.LocalPropertyManager;
    };
    client_id: string;
    client_secret: string;
}
export declare class GitHubSerializer implements webdav.FileSystemSerializer {
    uid(): string;
    serialize(fs: GitHubFileSystem, callback: webdav.ReturnCallback<GitHubSerializedData>): void;
    unserialize(serializedData: GitHubSerializedData, callback: webdav.ReturnCallback<GitHubFileSystem>): void;
}
