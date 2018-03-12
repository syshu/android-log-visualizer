// (logLines: string[])(...keywords: ...string[]) => logLines: string[]
export default (logLines) => (...keywords) => {
    return keywords.reduce((remaining, keyword) =>
                           logLines.filter(logLine =>
                                           logLine.includes(keyword)),
                           logLines)
}
