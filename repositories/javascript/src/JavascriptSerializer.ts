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
            
            data.currentWorkingDirectory = fs.currentWorkingDirectory;
            data.useEval = fs.useEval;
            callback(null, data);
        })
    }

    unserialize(serializedData : any, callback : webdav.ReturnCallback<webdav.FileSystem>) : void
    {
        super.unserialize(serializedData, (e, fs) => {
            if(e)
                return callback(e);
            
            const ffs = new JavascriptFileSystem(serializedData.useEval, serializedData.currentWorkingDirectory);
            for(const name in fs)
                ffs[name] = fs[name];
            ffs.setSerializer(this);

            callback(null, ffs);
        })
    }
}
