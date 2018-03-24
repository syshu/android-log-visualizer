/**
 * Log line filter by keywords.
 * @function findLogLine (logLines: string[]) => (...keywords: ...string[]) => logLines: string[]
 * @param {Array<string>} logLines Log lines to find something out from.
 * @param {...Array<string>} keywords
 * @returns {Array<string>} Log lines that include passed-in keywords.
 */
export default (logLines) => (...keywords) => {
    return keywords.reduce((remaining, keyword) =>
                           logLines.filter(logLine =>
                                           logLine.includes(keyword)),
                           logLines)
}
