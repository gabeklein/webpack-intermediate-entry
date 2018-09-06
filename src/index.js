const path = require("path")
const fs = require("fs")
const PLUGINID = "InitializeEntryPlugin";
const VirtualStats = require('./virtual-stats');

class InitializeEntryPlugin {

    constructor(options){
        const initFile = this.initFile = options.initFile;
        if(!initFile)
            throw new Error("This plugin needs an initializer { initFile } in options to include!")

        this.test = options.test;
        this.realEntries = {};
    }

    loadInitializerReplacement(relativeTo){
        const initFile = path.resolve(relativeTo, this.initFile)

        if (!fs.existsSync(initFile))
            throw new Error(`Initializer ${this.initFile} not found in ${relativeTo}!`)

        if (!fs.lstatSync(initFile).isFile())
            throw new Error(`Initializer ${initFile} found but is not a file!`)

        this.initFileText = fs.readFileSync(initFile, "utf-8")
    }

    apply(compiler) {

        const ctime = InitializeEntryPlugin.statsDate();

        // after entry and context options are loaded into webpack
        compiler.hooks.entryOption.tap(PLUGINID, 
            (context, entries) => {

                this.loadInitializerReplacement(context);
                this.context = context;

                if(typeof entries !== "object" || Array.isArray(entries))
                    entries = { main: entries }
                this.initEntries = {};
                for(const x in entries){
                    const e = entries[x];
                    this.initEntries[x] = 
                        typeof e == "string" ?
                        e : Array.isArray(e) ?
                            e[e.length - 1] :
                            false;
                }
            })

        //gain access to module construction
        compiler.hooks.normalModuleFactory.tap(PLUGINID,
            compilation => {

                //when a module is requested, but before webpack looks for it in filesystem
                compilation.hooks.beforeResolve.tap(PLUGINID, 
                    (result, b) => {
                        const target = result.dependencies[0]

                        //when a module is requested by the program as an entry point, NOT via require or import.
                        if (target.type == "single entry") {
                            let { loc } = target;

                            if(!loc) return result;

                            loc = typeof loc == "string"
                                ? loc.slice(0, loc.indexOf(":"))
                                : loc.name;

                            const replacableEntry = this.initEntries[loc];
                            if(result.request == replacableEntry){
                                const fs = compiler.inputFileSystem;
                                const initModule = replacableEntry.replace(/\.js$/, ".init.js");
                                const modulePath = path.join(this.context, initModule);
                                const contents = this.initFileText;

                                //create virtual entry replacement
                                InitializeEntryPlugin.populateFilesystem({ fs, modulePath, contents, ctime });
                                //assign file as new entry for bundle
                                result.request = initModule;
                                //register virtual module's real-life counterpart 
                                this.realEntries[initModule] = replacableEntry;
                            }
                        }

                        else if(result.request == "__webpack_entry__"){
                            const requestedBy = result.contextInfo.issuer;
                            const targetEntry = this.realEntries["./" + path.relative(this.context, requestedBy)];

                            if(!targetEntry)
                                throw new Error(`Module '__webpack_entry__' was requested by ${requestedBy} but that module is not an initializer!`)

                            result.request = path.join(this.context, targetEntry);
                        }
                    
                        return result;
                    });
            });
    }

    static populateFilesystem(options) {
        const fs = options.fs;
        const modulePath = options.modulePath;
        const contents = options.contents;
        const mapIsAvailable = typeof Map !== 'undefined';
        const statStorageIsMap = mapIsAvailable && fs._statStorage.data instanceof Map;
        const readFileStorageIsMap = mapIsAvailable && fs._readFileStorage.data instanceof Map;

        if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
            if (fs._readFileStorage.data.has(modulePath)) {
                return;
            }
        }

        const stats = InitializeEntryPlugin.createStats(options);

        if (statStorageIsMap) { // enhanced-resolve@3.4.0 or greater
            fs._statStorage.data.set(modulePath, [null, stats]);
        }

        if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
            fs._readFileStorage.data.set(modulePath, [null, contents]);
        }
    }

    static statsDate(inputDate) {
        if (!inputDate) {
            inputDate = new Date();
        }
        return inputDate.toString();
    }

    static createStats(options) {
        if (!options) {
            options = {};
        }
        if (!options.ctime) {
            options.ctime = InitializeEntryPlugin.statsDate();
        }
        if (!options.mtime) {
            options.mtime = InitializeEntryPlugin.statsDate();
        }
        if (!options.size) {
            options.size = 0;
        }
        if (!options.size && options.contents) {
            options.size = options.contents.length;
        }
        return new VirtualStats({
            dev: 8675309,
            nlink: 1,
            uid: 501,
            gid: 20,
            rdev: 0,
            blksize: 4096,
            ino: 44700000,
            mode: 33188,
            size: options.size,
            atime: options.mtime,
            mtime: options.mtime,
            ctime: options.ctime,
            birthtime: options.ctime,
        });
    }
}

module.exports = InitializeEntryPlugin;