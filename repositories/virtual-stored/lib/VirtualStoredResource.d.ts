import { v2 as webdav } from 'webdav-server';
export declare class VirtualStoredResource {
    type: webdav.ResourceType;
    propertyManager: webdav.LocalPropertyManager;
    lockManager: webdav.LocalLockManager;
    creationDate: number;
    lastModifiedDate: number;
    contentUID: string;
    constructor(data: VirtualStoredResource | webdav.ResourceType);
}
