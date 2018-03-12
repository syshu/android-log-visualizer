// 08-16 19:16:12.741 xxx -> 2018-08-16T19:16:12.752Z
export function getTime (logLine) {
    if (logLine[2] !== '-' || logLine[5] !== ' ' || logLine[8] !== ':' || logLine[14] !== '.') {
        throw new Error(`Log \`${logLine}\` is incorrect to get the time.`)
    }
    return `${new Date().getFullYear()}-${logLine.substr(0, 5)}T${logLine.substr(6, 12)}Z`
}

export function getProps (logLine) {
    const match = logLine.match(/^(\d\d-\d\d\s+\d\d:\d\d:\d\d.\d\d\d)\s+(\d+)\s+(\d+)\s+([EWDIVFS])\s+(?:([^\s]+)\s*:)?\s*(.*)/)
    if (!match) {
        throw new Error(`The line \`${logLine}\` is not a log line.`)
    }
    return { rawTime: match[1],
             time: getTime(logLine),
             pid: match[2],
             tid: match[3],
             priority: match[4],
             tag: match[5],
             msg: match[6], }
}

export function getProp (logLine, ...keywords) {
    return keywords.map(keyword => {
        if (keyword[0] === '$') {
            const value = getProps(logLine)[keyword.slice(1)]
            if (!value) {
                throw new Error(`Property \`${keyword}\` is unsupported.`)
            }
            return value
        }
        const match = logLine.match(new RegExp(keyword+/\s*[:=]?\s*([^\s,;\{\}\[\]\(\)]+)/.toString().slice(1, -1)))
        if (!match || !match[1]) {
            throw new Error(`Found no ${keyword} in \`${logLine}\``)
        }
        return match[1]
    }).join('&')
}

export function isLogLine (line) {
    return !!line.match(/^(\d\d-\d\d\s+\d\d:\d\d:\d\d.\d\d\d)\s+(\d+)\s+(\d+)\s+([EWDIVFS])\s+(?:([^\s]+)\s*:)?\s*(.*)/)
}

export function getFirstTime (logLines) {
    return getTime(logLines[0])
}

export function getLastTime (logLines) {
    return getTime(logLines[logLines.length - 1])
}

export function trimLogLines (logLines) {
    if (!(logLines instanceof Array)) {
        throw new Error('The parameter should be type of Array<string>')
    }
    while (logLines.length && !isLogLine(logLines[0])) {
        logLines.shift()
    }
    while (logLines.length && !isLogLine(logLines[logLines.length - 1])) {
        logLines.pop()
    }
    return logLines
}

export function sortLogLiness (logLiness) {
    if (!(logLiness instanceof Array) || (logLiness.length !== 0 && !(logLiness[0] instanceof Array))) {
        throw new Error('The parameter should be type of Array<Array<string>>')
    }
    logLiness.sort((logLines1, logLines2) => {
        const firstTime1 = getFirstTime(logLines1)
        const firstTime2 = getFirstTime(logLines2)
        return (new Date(firstTime1)) - (new Date(firstTime2))
    })
    for (let i = 0; i < logLiness.length - 1; i++) {
        const time1 = getLastTime(logLiness[i])
        const time2 = getFirstTime(logLiness[i+1])
        const time1v = new Date(time1)
        const time2v = new Date(time2)
        if (time1v > time2v) {
            throw new Error(`[${i}]th last time is later than [${i+1}]th first time`)
        }
    }
    return logLiness
}
