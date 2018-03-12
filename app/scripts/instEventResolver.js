import { getTime } from './logUtils.js'

// (getLogsByKeywords: function)(meta) => TLEvents
// getLogsByKeywords: (...keywords) => logLines: Array<string>
export default (getLogsByKeywords) => ({ keywords, title, tag }) => {
    let logs
    if (tag) {
        logs = getLogsByKeywords({ tag }, ...keywords)
    } else {
        logs = getLogsByKeywords(...keywords)
    }
    return logs.map(log => ({ id: log,
                              title: title || keywords[0],
                              description: log,
                              start: getTime(log), }))
}
