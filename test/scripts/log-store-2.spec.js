const rewire = require('rewire')
require('should')
const fs = require('fs-extra')
const fsp = require('pify')(require('fs'))
import LogStore2 from '../../app/scripts/log-store-2'

describe('LogStore2', function () {
    describe('.find', function () {
        const find = LogStore2.find
        it('single keyword, single target, bingo', function () {
            find('match', 'matched text').
                should.containDeep(['matched text'])
        })
        it('single keyword, single target, not bingo', function () {
            find('match', 'there is no such thing').
                should.containDeep([])
        })
        it('single keyword, arrayed targets', function () {
            find('apple', ['apple', 'pineapple', 'banana', 'app']).
                should.containDeep(['apple', 'pineapple'])
        })
        it('multi keyword, arrayed targets', function () {
            find(['apple', 'pine'], ['apple', 'pineapple', 'banana', 'app', 'pine']).
                should.containDeep(['pineapple'])
        })
    })
    describe('.readLines', function () {
        const readLines = LogStore2.readLines
        it('read lines', async function () {
            const lines = await readLines('test/res/log-store-test-2.txt')
            lines.should.containDeep(['This is the second file.\r', 'This is the second line.'])
        })
    })
    describe('integrated test', async function () {
        const find = LogStore2.find
        const loadFile = LogStore2.loagFile
        const ls = new LogStore2
        await ls.loadFile('test/res/log-store-test-2.txt')
        ls.find('line').
            should.containDeep(['This is the second line.']).
            and.have.length(1)
    })
})
