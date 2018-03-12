import logFinder from './logFinder'
const readFile = require('pify')(require('fs')).readFile

// (...filePaths)(...keywords): matchedLogs
export default async (...filePaths) =>
    logFinder(...(await Promise.all(filePaths.map(filePath =>
                                                  readFile(filePath, 'utf-8')))))
