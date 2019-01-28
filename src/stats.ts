import constants from "constants"

export function appendToFilesystem(
    fs: any, 
    modulePath: string, 
    contents: string){

    const readFileStorageIsMap = fs._readFileStorage.data instanceof Map;

    if (readFileStorageIsMap && fs._readFileStorage.data.has(modulePath))
        return;

    if (fs._statStorage.data instanceof Map)
        fs._statStorage.data.set(modulePath, [
            null, new StatsForVirtualFile(contents)
        ]);

    if (readFileStorageIsMap) 
        fs._readFileStorage.data.set(modulePath, [
            null, contents
        ]);
}

class StatsForVirtualFile {

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

    isFile() {
        return this._checkModeProperty(constants.S_IFREG);
    }
}