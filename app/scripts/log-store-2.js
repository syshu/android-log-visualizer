const pify = require('pify')
const fs = require('fs')
const fsp = pify(fs)
const LogStore = require('./log-store.js')
const Log = LogStore.Log

class LogStore2 extends LogStore {
    constructor () {
        super()
    }

    static find (match:string|Array<string>, logTxt:string|Array|Object):Array<string> {
        if (typeof match === 'string') {
            if (typeof logTxt === 'string') {
                return logTxt.includes(match)?[logTxt]:[]
            } else if (logTxt instanceof Array){
                return [].concat(...logTxt.map(LogStore2.find.bind(null, match)))
            } else {
                const strs = Object.values()
                return [].concat(...strs.map(LogStore2.find.bind(null, match)))
            }
        } else {
            return match.reduce((sum, item) => LogStore2.find(item, sum), logTxt)
        }
    }

    static async readLines (url:string):Array<string> {
        const fileStr = await fsp.readFile(url, 'utf-8')
        return fileStr.split('\n')
    }

    async loadFile (url:string) {
        this.store[url] = await LogStore2.readLines(url)
    }


}

module.exports = LogStore2
