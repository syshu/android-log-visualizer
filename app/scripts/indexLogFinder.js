import findLogLine from './findLogLine.js'
import { trimLogLines, sortLogLiness } from './logUtils.js'

// (...logTxts: ...string[]) => ({ tag: string }?, ...keywords: ...string[]) => logLines: string[]
export default (...logTxts) => {
    const logLiness = logTxts.map(fileTxt => fileTxt.split('\n'))
    logLiness.forEach(logLines => {trimLogLines(logLines)})
    sortLogLiness(logLiness)
    const logLines = [].concat(...logLiness)
    const dict = {}
    logLines.forEach(logLine => {
        const index = logLine.substr(33, 3)
        if (!dict[index]) {
            dict[index] = []
        }
        dict[index].push(logLine)
    })
    return (...keywords) => {
        if (typeof keywords[0] === 'object') {
            const { tag } = keywords.shift() //First element could be the tag.
            return findLogLine(dict[tag.substr(0, 3)])(...keywords)
        }
        return findLogLine(logLines)(...keywords)
    }
}
