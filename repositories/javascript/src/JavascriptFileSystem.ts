import { JavascriptSerializer } from './JavascriptSerializer'
import { Readable } from 'stream'
import { v2 as webdav } from 'webdav-server'
import { spawn } from 'child_process'
import { join } from 'path'

export class JavascriptFileSystem extends webdav.VirtualFileSystem
{
    constructor(public useEval : boolean = false, public currentWorkingDirectory ?: string)
    {
        super(new JavascriptSerializer());
    }

    protected _openReadStream(path : webdav.Path, ctx : webdav.OpenReadStreamInfo, callback : webdav.ReturnCallback<Readable>) : void
    {
        super._openReadStream(path, ctx, (e, rStream) => {
            if(e)
                return callback(e);
            if(ctx.targetSource)
                return callback(e, rStream);
            
            if(this.useEval)
            {
                let data = '';
                rStream.on('data', (chunk : Buffer | string) => {
                    data += chunk.toString();
                })
                rStream.on('end', () => {
                    if(!data || data.length === 0)
                        return callback(null, new Readable({
                            read()
                            {
                                this.push(null);
                                return false;
                            }
                        }));

                    let go = (value) => {
                        if(!go)
                            return;
                        go = () => {};
                        callback(null, new Readable({
                            read()
                            {
                                this.push(value.toString());
                                this.push(null);
                                return false;
                            }
                        }));
                    }
                    const result = eval('(function(systemCallback){' + data + '})')((value) => {
                        go(value);
                    });
                    if(result)
                        go(result);
                })

                return;
            }
            
            const p = spawn('node', [ ], {
                cwd: this.currentWorkingDirectory
            });
            if(!p.pid)
                return callback(webdav.Errors.Forbidden);
            
            rStream.pipe(p.stdin);
            p.stderr.pipe(process.stdout);
            callback(null, p.stdout);
        })
    }

    protected _size(path : webdav.Path, ctx : webdav.SizeInfo, callback : webdav.ReturnCallback<number>): void
    {
        callback(null, undefined);
    }
}
