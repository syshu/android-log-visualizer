import LogStore from './log-store-2'

//Concludes: title, description, id, start, end, durationEvent:boolean
export default class TLEventStore extends LogStore {
    /**
     * Create a TLEventStore, it's used to store TLEvents.
     * @param matches - A match can be a keyword, keywords or a RegExp. This is an array of them.
     */
    constructor(matches?:Array<{title:string, match?:string, beginnerMatch?:string, enderMatch?:string}>) {
        super()
        this.matchs = matches || []
    }

    fetchLogs(match:string|Array<string>):Array<Object> {
        return this.findLogs(match)
    }

    /**
     * Add matches to the TLEventStore.
     * @param matches - Array of matches who can be a keyword, keywords or a RegExp.
     */
    addMatches(matches:Array<string>) {
        this.keywords.concat(matches)
    }

    static parseDuraEvent(title:string, log1:?Object, log2?:Object) {
        const titlePrefix = log1?log2?'':'Start of ':'End of '
        const {time, pid, tid, priority, tag, msg} = log1 || log2
        return {
            title: titlePrefix + title,
            id: time,
            description: pid+' '+tid+' '+priority+' '+tag+': '+msg,
            start: time,
            durationEvent: log1 && log2 && true,
            end: log1 && log2 && log2.time
        }
    }

    static parseInstEvent(title:string, log:Object) {
        const {time, pid, tid, priority, tag, msg} = log
        return {
            title: title,
            id: time,
            description: pid+' '+tid+' '+priority+' '+tag+': '+msg,
            start: time
        }
    }

    fetchEventsByRules(rules:Array<{ title:string, match?:string|Array<string>, beginnerMatch?:string|Array<string>, enderMatch?:string|Array<string>}>|Object) {
        const eventss = (rules instanceof Array?rules:[rules]).map(rule=>{
            const { title, match, beginnerMatch, enderMatch } = rule
            if (match) return this.fetchInstEvents(title, match)
            else if (beginnerMatch && enderMatch) return this.fetchDuraEvents(title, beginnerMatch, enderMatch)
            else throw `Unexpected rule format: ${JSON.stringify(rule)}`
        })
        return [].concat(...eventss)
    }

    fetchInstEvents(title:string, match:string|Array<string>):Array<Object> {
        return this.fetchLogs(match).map(TLEventStore.parseInstEvent.bind(null, title))
    }

    fetchDuraEvents(title:string, match1:string|Array<string>, match2:string|Array<string>):Array<Object> {
        const logs1 = this.fetchLogs(match1)
        logs1.forEach(log=>{log.sOrE='start'})
        const logs2 = this.fetchLogs(match2)
        logs2.forEach(log=>{log.sOrE='end'})
        //Sorted logs, in order from former to recent.
        const logs = [].concat(logs1, logs2).sort((a, b)=>a-b)
        const startrLogs = []
        const duraEvents = []
        for (let log of logs) {
            if (log.sOrE==='start') startrLogs.push(log)
            else if (log.sOrE==='end') duraEvents.push(
                TLEventStore.parseDuraEvent(title, startrLogs.pop(), log)
            )
            else {throw new Error('Unexpected log.sOrE: '+log.sOrE)}
        }
        for (let log of startrLogs) {
            duraEvents.push(TLEventStore.parseDuraEvent(title, log, undefined))
        }
        return duraEvents
    }
}
