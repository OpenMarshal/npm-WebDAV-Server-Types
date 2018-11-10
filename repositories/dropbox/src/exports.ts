import { DropboxFileSystem } from './DropboxFileSystem'
import { DropboxSerializer } from './DropboxSerializer'

export * from './DropboxFileSystem'
export * from './DropboxSerializer'

export const info = {
    settings: [{
        key: 'accessKey',
        type: 'string',
        required: true
    }],
    fs: DropboxFileSystem,
    serializer: new DropboxSerializer()
};

