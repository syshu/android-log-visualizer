import logFinder from './logFinder'
const readFile = require('pify')(require('fs')).readFile

/**
 * 
 * @function fileLogFinder (...filePaths: string[]) => await (...keywords: string[]) => matchedLogs
 */
export default async (...filePaths) =>
    logFinder(...(await Promise.all(filePaths.map(filePath =>
                                                  readFile(filePath, 'utf-8')))))
