const pify = require('pify')
const fs = require('fs')
const fsp = pify(fs)
import listApplogFiles from './list-applog-files'

class LogStore {
    /**
     * Get an array of lines that contains specified key in the logTxt.
     * @param match - Can be string, strings or RegExp.
     * @param logTxt that can be of multi-line got from a log file or single line.
     * @returns {Array|{index: number, input: string}|Array}
     */
    static find(match:string|Array<string>, logTxt:string|Array<string>):Array<string> {
        //return logTxt.match(new RegExp('[^\\n]*'+key+'[^\\r\\n]*', 'g'))
        if (typeof match === 'string') {
            if (typeof logTxt === 'string') return logTxt.match(new RegExp('.*'+match+'.*', 'g')) || []
            else if (logTxt instanceof Array) return [].concat(...logTxt.map(LogStore.find.bind(null, match)))
        } else if (match instanceof Array) {
            return match.reduce((sum, item)=>LogStore.find(item, sum), logTxt)
        }
    }

    constructor() {
        this.store = {}
    }

    async loadFile(url:string) {
        this.store[url] = await fsp.readFile(url, 'utf-8')
    }

    async loadFiles(urls:Array<string>) {
        await Promise.all(urls.map(this.loadFile.bind(this)))
    }

    async loadFord(url:string) {
        const applogFiles = await listApplogFiles(url)
        await this.loadFiles(applogFiles)
    }

    async loadFords(urls:Array<string>|string) {
        if (typeof urls === 'string') return await this.loadFord(urls)
        await Promise.all(urls.map(this.loadFord.bind(this)))
    }

    find(match:string|Array<string>):Array<string> {
        return LogStore.find(match, Object.values(this.store))
    }

    findLogs(match:string|Array<string>):Array<Log> {
        const logLines = this.find(match)
        return logLines.map(str=>(new LogStore.Log(str)))
    }
}

class Log {
    static parseISOTime(logLine:string):string {//iso8601
        return logLine.replace(/^(\d\d-\d\d)\s+(\d\d:\d\d:\d\d.\d\d\d).*/,
            new Date().getFullYear()+'-$1T$2Z')
    }

    static parseTime(logLine:string):Date {
        const dateStr = logLine.match(/^\d\d-\d\d\s+\d\d:\d\d:\d\d.\d\d\d/)
        const date = new Date(dateStr)
        date.getActualMonth = function() {
            return this.getMonth()+1
        }
        return date
    }

    static resolve(logLine:string):{time:string, pid:string, tid:string, priority:string, tag:string, msg:string} {
        const match = logLine.match(/^(\d\d-\d\d\s+\d\d:\d\d:\d\d.\d\d\d)\s+(\d+)\s+(\d+)\s+([EWDIVFS])\s+(?:([^\s]+)\s*:)?\s*(.*)/)
        return {
            time: Log.parseISOTime(match[1]),
            pid: match[2],
            tid: match[3],
            priority: match[4],
            tag: match[5],
            msg: match[6]
        }
    }

    static seekVal(paramName:string, logLine:string):string {
        const match = logLine.match(new RegExp(paramName+/\s*[:=]?\s*([^\s,;\{\}\[\]\(\)]+)/.toString().slice(1, -1)))
        try {return match[1]} catch(e) {
            e.message += `: Found value is ${match}`
            throw e
        }
    }

    constructor(logLine:string) {
        this.raw = logLine
        this.resolve()
    }

    resolve():void {
        const match = Log.resolve(this.raw)
        Object.assign(this, match)
    }

    seekVal(paramName:string):string {
        return Log.seekVal(paramName, this.msg)
    }

    toString():string {
        return this.raw
    }

    valueOf():number {
        return (new Date(this.time)).valueOf()
    }
}

LogStore.Log = Log
module.exports = LogStore
