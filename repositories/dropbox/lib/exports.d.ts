import { DropboxFileSystem } from './DropboxFileSystem';
import { DropboxSerializer } from './DropboxSerializer';
export * from './DropboxFileSystem';
export * from './DropboxSerializer';
export declare const info: {
    settings: {
        key: string;
        type: string;
        required: boolean;
    }[];
    fs: typeof DropboxFileSystem;
    serializer: DropboxSerializer;
};
