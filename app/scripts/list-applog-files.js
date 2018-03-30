const fs = require('fs')
const Path = require('path')
const fsp = require('pify')(fs)
const decompress = require('decompress')

function isArchive(filepath) {
    return !!filepath.match(/(.zip|.gz)$/)
    //return Path.extname(path)==='.zip'
}

async function listArchive(archPath) {
    const files = await decompress(archPath, archPath+'.extract')
    return await listFord(archPath+'.extract')
    //return files.map(fileInArch=>Path.join(archPath+'.extract', fileInArch.path))
}

async function listFord(path):Array<string> {
    const dirStat = await fsp.stat(path)
    if (dirStat.isFile()) {
        if (isArchive(path)) return listArchive(path)
        else return [path]
    }
    const shrtFiles = await fsp.readdir(path)
    const lngFiles = shrtFiles.map(name => Path.join(path, name))
    const asyncFiless = lngFiles.map(listFord)
    const filess = await Promise.all(asyncFiless)
    const files = [].concat(...filess)
    //Remove dumplicate items.
    let obj = {}
    for (let item of files) obj[item] = true
    return Object.keys(obj)
}

async function isApplogFile(file) {
    if (file.includes('applogcat')) {
        return true
    }
    if (file.includes('eventslogcat') || file.includes('dump')) {
        return false
    }
    const str = await fsp.readFile(file, 'utf-8')
    return /(\d\d-\d\d\s+\d\d:\d\d:\d\d.\d\d\d)\s+(\d+)\s+(\d+)\s+([EWDIVFS])\s+/.test(str)
}

async function listApplogFiles(path:string):Promise<Array<string>> {
    const files = await listFord(path)
    const mask = await Promise.all(files.map(isApplogFile))
    return files.filter((item, index)=>mask[index])
}

module.exports = listApplogFiles
