import { getTime, getProp } from './logUtils.js'

// getLogsByKeywords: (...keywords) => logLines: Array<string>
// classifyBy: [propName: string, ...]
export default (getLogsByKeywords) => (meta) => {
    const { starterKeywords, enderKeywords, title, classifyBy, tag, enderTag } = meta
    let starterLogs
    let enderLogs
    if (tag) {
        starterLogs = getLogsByKeywords({ tag }, ...starterKeywords)
        enderLogs = getLogsByKeywords({ tag: enderTag || tag }, ...enderKeywords)
    } else {
        starterLogs = getLogsByKeywords(...starterKeywords)
        enderLogs = getLogsByKeywords(...enderKeywords)
    }
    const starterLogObjs = starterLogs.
          map(log => ({ log,
                        type: 'STARTER',
                        class: classifyBy ? getProp(log, ...classifyBy) : '' }))
    const enderLogObjs = enderLogs.
          map(log => ({ log,
                        type: 'ENDER',
                        class: classifyBy ? getProp(log, ...classifyBy) : '' }))
    const combinedLogObjs = mergeSortedArrays((logObj1, logObj2) =>
                                              compTime(logObj1.log, logObj2.log),
                                              starterLogObjs,
                                              enderLogObjs)
    const classifiedLogObjs = {} //{'propName': [log, ...], ...}
    const events = []
    combinedLogObjs.forEach(logObj => {
        if (!classifiedLogObjs[logObj.class]) {
            classifiedLogObjs[logObj.class] = []
        }
        const logObjs = classifiedLogObjs[logObj.class]
        if (logObj.type === 'STARTER') {
            logObjs.push(logObj)
        } else if (logObj.type === 'ENDER') {
            const popedLogObj = logObjs.pop()
            events.push(makeDuraEvent({ title },
                                      popedLogObj && popedLogObj.log,
                                      logObj.log))
        } else {
            throw new Error('Unknown error.')
        }
    })
    Object.values(classifiedLogObjs).forEach(logObjs => {
        let logObj
        while (logObj = logObjs.pop()) { // That's correct, a = but not a ===.
            events.push(makeDuraEvent({ title }, logObj.log, null))
        }
    })
    return events
}

export function makeDuraEvent ({ title }, logLine1, logLine2) {
    if (!logLine1 && !logLine2) {
        throw new Error('Both 2 log lines are undefined.')
    } else if (!logLine1 || !logLine2) {
        return { id: logLine1 || logLine2,
                 title,
                 durationEvent: false,
                 description: (logLine1 ? 'Start' : 'End') +
                              ' of ' +
                              (logLine1 || logLine2),
                 start: logLine1 ? getTime(logLine1) : getTime(logLine2), }
    } else {
        return { id: `${logLine1}\n${logLine2}`,
                 title,
                 durationEvent: true,
                 description: `${logLine1}\n${logLine2}`,
                 start: getTime(logLine1),
                 end: getTime(logLine2), }
    }
}

// compare: (item1, item2) => whoIsBigger: number
// negative -> [item1, item2], equal -> [?], positive -> [item2, item1]
export function mergeSortedArrays (compare, array1, array2) {
    if (!array1.length) {
        return array2
    }
    if (!array2.length) {
        return array1
    }
    let cursor1 = 0, cursor2 = 0
    let merged = []
    while (cursor1 < array1.length && cursor2 < array2.length) {
        const compResult = compare(array1[cursor1], array2[cursor2])
        merged.push(compResult < 0 ? array1[cursor1++] : array2[cursor2++])
    }
    if (cursor1 < array1.length) {
        merged = merged.concat(array1.slice(cursor1))
    }
    if (cursor2 < array2.length) {
        merged = merged.concat(array2.slice(cursor2))
    }
    return merged
}

export function compTime (logLine1, logLine2) {
    const time1v = new Date(getTime(logLine1))
    const time2v = new Date(getTime(logLine2))
    return time1v - time2v
}
