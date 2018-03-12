require('should')

import logFinder from '../../app/scripts/logFinder.js'
import fileLogFinder from '../../app/scripts/fileLogFinder.js'
import { getTime,
         getProps,
         isLogLine,
         trimLogLines,
         getFirstTime,
         getLastTime,
         sortLogLiness,
         getProp, } from '../../app/scripts/logUtils.js'
import adaptParamTxtToPath from '../../app/scripts/adaptParamTxtToPath.js'
import findLogLine from '../../app/scripts/findLogLine.js'
import indexLogFinder from '../../app/scripts/indexLogFinder.js'

const log1 = '08-16 19:16:12.752  2514  2514 I BetaNotificationManager: ' +
      'type: packing; id: 1002; size: 568980503; notificationLogId: 91612'
const log2 = '08-16 19:16:13.753  2514  2514 I BetaNotificationManager: some message'
const log3 = '08-16 19:16:13.754  2514  2514 I BetaNotificationManager: some message2'
const log4 = '08-16 19:16:13.754  2514  2514 I Tag1: some message2'
const notLog = '08-16 19:16:13.754  2514  2514 I'

describe('logUtils tests', function () {
    it('getTime', function () {
        getTime(log1).
            should.be.equal(`${new Date().getFullYear()}-08-16T19:16:12.752Z`)
    })
    it('getProps', function () {
        getProps(log1).
            should.
            containDeep({ rawTime: '08-16 19:16:12.752',
                          time: `${new Date().getFullYear()}-08-16T19:16:12.752Z`,
                          pid: '2514',
                          tid: '2514',
                          priority: 'I',
                          tag: 'BetaNotificationManager',
                          msg: 'type: packing; id: 1002; size: 568980503; notificationLogId: 91612', })
    })
    describe('getProp', function () {
        it('got', function () {
            getProp(log1, 'type').should.be.equal('packing')
            getProp(log1, 'id').should.be.equal('1002')
            getProp(log1, 'size').should.be.equal('568980503')
            getProp(log1, 'notificationLogId').should.be.equal('91612')
            getProp(log1, '$time').should.be.equal(`${new Date().getFullYear()}-08-16T19:16:12.752Z`)
            getProp(log1, '$pid').should.be.equal('2514')
        })
        it('multi keywords', function () {
            getProp(log1, 'type', '$pid').
                should.be.equal('packing&2514')
        })
        it('invalid prop name', function () {
            (function () {
                getProp(log1, '$time1')
            }).should.throw()
        })
        it('not exist prop name', function () {
            (function () {
                getProp(log1, 'nonExistPropName')
            }).should.throw()
        })
    })
    describe('isLogLine', function () {
        it('is', function () {
            isLogLine(log1).should.be.equal(true)
        })
        it('is not', function () {
            isLogLine(notLog).should.be.equal(false)
        })
    })
    describe('trimLogLines', function () {
        it('double side paddings', function () {
            trimLogLines([ '', '', log1, log2, '', '' ]).
                should.containDeep([ log1, log2 ]).
                and.have.length(2)
        })
        it('no log lines', function () {
            trimLogLines([ '', '', '' ]).
                should.be.instanceof(Array).
                and.have.length(0)
        })
    })
    it('getFirstTime', function () {
        getFirstTime([ log1, log2, log3 ]).
            should.be.equal(`${new Date().getFullYear()}-08-16T19:16:12.752Z`)
    })
    it('getLastTime', function () {
        getLastTime([ log1, log2, log3 ]).
            should.be.equal(`${new Date().getFullYear()}-08-16T19:16:13.754Z`)
    })
    describe('sortLogLiness', function () {
        it('sort', function () {
            sortLogLiness([[log2, log3], [log1]]).
                should.containDeep({'0': [log1], '1': [log2, log3]})
        })
        it('disorder', function () {
            (function () {
                sortLogLiness([[log2], [log1, log3]])
            }).should.throw()
        })
        it('empty array', function () {
            sortLogLiness([]).
                should.be.instanceOf(Array).
                and.have.length(0)
        })
        it('1 logLines', function () {
            sortLogLiness([[log2, log3]]).
                should.containDeep([[log2, log3]]).
                and.have.length(1)
        })
    })
})
describe('logFinder', function () {
    const findLog = logFinder(`${log1}\n${log2}`, log3)
    it('single keyword', function () {
        findLog('some message').
            should.containDeep([ log2, log3 ]).
            and.have.length(2)
    })
    it('multi keywords', function () {
        findLog('message', '753').
            should.containDeep([ log2 ]).
            and.have.length(1)
    })
})
describe('fileLogFinder', function () {
     it('load files and have right amount of lines', async function () {
        let findLog = await fileLogFinder('./test/res/small-log-1.txt', './test/res/small-log-2.txt')
        findLog('19').
            should.have.length(5)
    })
})
describe('adaptParamTxtToPath', function () {
    const fileLogFinder = adaptParamTxtToPath(logFinder)
    it('load files and have right amount of lines', async function () {
        let findLog = await fileLogFinder('./test/res/small-log-1.txt', './test/res/small-log-2.txt')
        findLog('19').
            should.have.length(5)
    })
})
describe('findLogLine', function () {
    it('single keyword', function () {
        findLogLine([ log1, log2, log3 ])('some message').
            should.containDeep([ log2, log3 ]).
            and.have.length(2)
    })
    it('multi keywords', function () {
        findLogLine([ log1, log2, log3 ])('message', '753').
            should.containDeep([ log2 ]).
            and.have.length(1)
    })
})
describe('indexLogFinder', function () {
    const findLog = indexLogFinder(`${log1}\n${log2}`, log3, log4 )
    it('without tag', function () {
        findLog('BetaNotificationManager', 'some message2').
            should.containDeep([ log3, log4 ]).
            and.have.length(2)
    })
    it('with tag', function () {
        findLog({ tag: 'BetaNotificationManager' }, 'some message').
            should.containDeep([ log2, log3 ]).
            and.have.length(2)
    })
})
