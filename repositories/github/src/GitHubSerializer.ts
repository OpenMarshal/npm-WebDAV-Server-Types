import { GitHubFileSystem } from './GitHubFileSystem'
import { v2 as webdav } from 'webdav-server'

export interface GitHubSerializedData
{
    organisation : string
    repository : string
    properties : {
        [path : string] : webdav.LocalPropertyManager
    }
    client_id : string
    client_secret : string
}

export class GitHubSerializer implements webdav.FileSystemSerializer
{
    uid() : string
    {
        return 'GitHubSerializer-1.0.0';
    }

    serialize(fs : GitHubFileSystem, callback : webdav.ReturnCallback<GitHubSerializedData>) : void
    {
        callback(null, {
            properties: fs.properties,
            organisation : fs.organisation,
            client_id : fs.client_id,
            client_secret : fs.client_secret,
            repository : fs.repository
        });
    }

    unserialize(serializedData : GitHubSerializedData, callback : webdav.ReturnCallback<GitHubFileSystem>) : void
    {
        const fs = new GitHubFileSystem(serializedData.organisation, serializedData.repository, serializedData.client_id, serializedData.client_secret);

        for(const path in serializedData.properties)
            fs.properties[path] = new webdav.LocalPropertyManager(serializedData.properties[path]);

        callback(null, fs);
    }
}
