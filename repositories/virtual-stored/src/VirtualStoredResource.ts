import { v2 as webdav } from 'webdav-server'

export class VirtualStoredResource
{
    type : webdav.ResourceType
    propertyManager : webdav.LocalPropertyManager
    lockManager : webdav.LocalLockManager
    creationDate : number
    lastModifiedDate : number
    contentUID : string

    constructor(data : VirtualStoredResource | webdav.ResourceType)
    {
        if(data.constructor === webdav.ResourceType)
        {
            this.type = data as webdav.ResourceType;
            this.propertyManager = new webdav.LocalPropertyManager();
            this.creationDate = Date.now();
            this.lastModifiedDate = this.creationDate;
            this.contentUID = undefined;
        }
        else
        {
            const r = data as VirtualStoredResource;

            this.type = r.type;
            this.propertyManager = new webdav.LocalPropertyManager(r.propertyManager);
            this.creationDate = r.creationDate;
            this.lastModifiedDate = r.lastModifiedDate;
            this.contentUID = r.contentUID;
        }

        this.lockManager = new webdav.LocalLockManager();
    }
}
