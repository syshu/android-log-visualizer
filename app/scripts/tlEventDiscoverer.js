import combineResolvers from './combineResolvers.js'
import duraEventResolver from './duraEventResolver.js'
import instEventResolver from './instEventResolver.js'
import adaptParamTxtToPath from './adaptParamTxtToPath.js'
import indexLogFinder from './indexLogFinder.js'
import listApplogFiles from './list-applog-files.js'

// (logFolder) ==> (rule) => TLEvents
export default async (logFolder) => {
    const logFilePaths = await listApplogFiles(logFolder)
    const getLogsByTagAndKeywords = await adaptParamTxtToPath(indexLogFinder)(...logFilePaths)
    const combinedResolver = combineResolvers({ INST: instEventResolver,
                                                DURA: duraEventResolver, })
    const getEventsByRule = combinedResolver(getLogsByTagAndKeywords)
    return getEventsByRule
}
