import constants from "constants"

export default function populateFakeFile(
    fs: any, 
    modulePath: string, 
    contents: string){

    if(fs._readFileStorage.data instanceof Map){
        if(fs._readFileStorage.data.has(modulePath)) return;
        fs._readFileStorage.data.set(modulePath, [null, contents]);
    }

    const stats = new VirtualStats(contents);

    if(fs._statStorage.data instanceof Map) 
        fs._statStorage.data.set(modulePath, [null, stats]);
}

class VirtualStats {

    dev = 8675309
    nlink = 1
    uid = 501
    gid = 20
    rdev = 0
    blksize = 4096
    ino = 44700000
    mode = 33188
    
    atime: string;
    mtime: string;
    ctime: string;
    birthtime: string;
    length: number;

    constructor(contents: string) {
        this.length = 
            contents.length;

        this.atime = 
        this.mtime = 
        this.ctime = 
        this.birthtime = 
            new Date().toString();
    }

    _checkModeProperty(property: any) {
        return (this.mode & constants.S_IFMT) === property;
    }

    isDirectory() {
        return this._checkModeProperty(constants.S_IFDIR);
    }

    isFile() {
        return this._checkModeProperty(constants.S_IFREG);
    }

    isBlockDevice() {
        return this._checkModeProperty(constants.S_IFBLK);
    }

    isCharacterDevice() {
        return this._checkModeProperty(constants.S_IFCHR);
    }

    isSymbolicLink() {
        return this._checkModeProperty(constants.S_IFLNK);
    }

    isFIFO() {
        return this._checkModeProperty(constants.S_IFIFO);
    }

    isSocket() {
        return this._checkModeProperty(constants.S_IFSOCK);
    }
}