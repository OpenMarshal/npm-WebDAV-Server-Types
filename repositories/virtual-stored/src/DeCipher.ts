import * as crypto from 'crypto'

export interface DeCipherOptions
{
    masterNbIteration : number
    minorNbIteration : number
    cipherIvSize : number
    keyLen : number
    cipher : string
    hash : string
    salt : string | Buffer
}

export class DeCipher
{
    master : Buffer
    key : Buffer
    sUid : string
    
    constructor(password : string, public config : DeCipherOptions)
    {
        const sha1 = crypto.createHash('sha1');
        sha1.update([
            'masterNbIteration',
            'minorNbIteration',
            'cipherIvSize',
            'keyLen',
            'cipher',
            'hash'
        ].map((k) => this.config[k]).join(':'));
        this.sUid = sha1.digest('hex');

        const salt = config.salt.constructor === Buffer ? config.salt : new Buffer(config.salt as string);
        this.master = crypto.pbkdf2Sync(password, salt, this.config.masterNbIteration, this.config.keyLen, this.config.hash);
        
        const hmac = crypto.createHmac(this.config.hash, this.master);
        hmac.update('key');
        this.key = hmac.digest();
    }

    uid() : string
    {
        return this.sUid;
    }
    
    buildIV(seed)
    {
        const ivSeed = crypto.pbkdf2Sync(seed, this.master, this.config.minorNbIteration, this.config.keyLen, this.config.hash);
        const hmac = crypto.createHmac(this.config.hash, ivSeed);
        hmac.update('iv');
        return hmac.digest().slice(0, this.config.cipherIvSize);
    }
    
    newCipher(seed)
    {
        const cipher = crypto.createCipheriv(this.config.cipher, this.key, this.buildIV(seed));
        return cipher;
    }

    newDecipher(seed)
    {
        const cipher = crypto.createDecipheriv(this.config.cipher, this.key, this.buildIV(seed));
        return cipher;
    }
}
