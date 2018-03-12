const readFile = require('pify')(require('fs')).readFile

// (txtParamedFunc) => async pathParamedFunc
// txtParamedFunc: (...txts) => T
// async pathParamedFunc: (...paths) => Promise<T>
export default (txtParamedFunc) => async (...paths) =>
    txtParamedFunc(...(await Promise.all(paths.map(path =>
                                                   readFile(path, 'utf-8')))))
