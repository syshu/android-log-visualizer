import findLogLine from './findLogLine.js'
import { trimLogLines, sortLogLiness } from './logUtils.js'

// (...logTxts: string[])(...keywords: string[]): matchedLogs
export default (...logTxts) => {
    const logLiness = logTxts.map(fileTxt => fileTxt.split('\n'))
    logLiness.forEach(logLines => {trimLogLines(logLines)})
    sortLogLiness(logLiness)
    const logLines = [].concat(...logLiness)
    return (...keywords) =>
        findLogLine(logLines)(...keywords)
}
