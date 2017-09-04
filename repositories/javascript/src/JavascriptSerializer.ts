import { JavascriptFileSystem } from './JavascriptFileSystem'
import { v2 as webdav } from 'webdav-server'

export class JavascriptSerializer extends webdav.VirtualSerializer
{
    uid() : string
    {
        return 'JavascriptSerializer-1.0.0';
    }

    serialize(fs : JavascriptFileSystem, callback : webdav.ReturnCallback<any>) : void
    {
        super.serialize(fs, (e, data) => {
            if(e)
                return callback(e);
            
            data.options = fs.options;
            callback(null, data);
        })
    }

    unserialize(serializedData : any, callback : webdav.ReturnCallback<webdav.FileSystem>) : void
    {
        super.unserialize(serializedData, (e, fs) => {
            if(e)
                return callback(e);

            const options = serializedData.useEval !== undefined ? {
                useEval: serializedData.useEval,
                currentWorkingDirectory: serializedData.currentWorkingDirectory
            } : serializedData.options;
            
            const ffs = new JavascriptFileSystem(options);
            for(const name in fs)
                ffs[name] = fs[name];
            ffs.setSerializer(this);

            callback(null, ffs);
        })
    }
}
