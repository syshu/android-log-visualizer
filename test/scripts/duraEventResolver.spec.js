require('should')

import duraEventResolver, { makeDuraEvent,
                            mergeSortedArrays,
                            compTime } from '../../app/scripts/duraEventResolver.js'

const log1 = '08-16 19:16:13.752  2514  2514 I Tag1: some message1'
const log2 = '08-16 19:16:13.753  2514  2514 I Tag1: some message2'
const justEnderLog = '08-16 19:16:13.754  2514  2514 I AudioPolicyManager: just ender stopOutput session: 1'
const log3 = '08-16 19:16:13.755  2514  2514 I AudioPolicyManager: basic startOutput session: 1'
const log4 = '08-16 19:16:13.756  2514  2514 I AudioPolicyManager: another sess startOutput session: 2'
const log5 = '08-16 19:16:13.757  2515  2515 I AudioPolicyManager: another pid startOutput session: 1'
const log6 = '08-16 19:16:13.758  2515  2515 I AudioPolicyManager: another pid stopOutput session: 1'
const log7 = '08-16 19:16:13.759  2514  2514 I AudioPolicyManager: basic stopOutput session: 1'
const log8 = '08-16 19:16:13.760  2514  2514 I AudioPolicyManager: another sess stopOutput session: 2'
const justStarterLog = '08-16 19:16:13.761  2514  2514 I AudioPolicyManager: just starter stopOutput session: 1'
const starterLogs = [log3, log4, log5, justStarterLog]
const enderLogs = [justEnderLog, log6, log7, log8]

describe('duraEventResolver', function () {
    describe('compTime', function () {
        it('1', function () {
            compTime(log1, log2).
                should.be.below(0)
            compTime(log2, log1).
                should.be.above(0)
        })
    })
    describe('makeDuraEvent', function () {
        it('dura event', function () {
            makeDuraEvent({ title: 'title1' }, log1, log2).
                should.
                containDeep({ id: `${log1}\n${log2}`,
                              title: 'title1',
                              durationEvent: true,
                              description: `${log1}\n${log2}`,
                              start: `${new Date().getFullYear()}-08-16T19:16:13.752Z`,
                              end: `${new Date().getFullYear()}-08-16T19:16:13.753Z`, })
        })
        it('just starter', function () {
            makeDuraEvent({ title: 'title1' }, log1).
                should.
                containDeep({ id: log1,
                              title: 'title1',
                              durationEvent: false,
                              description: 'Start of ' + log1,
                              start: `${new Date().getFullYear()}-08-16T19:16:13.752Z`, })
        })
        it('just ender', function () {
            makeDuraEvent({ title: 'title1' }, null, log1).
                should.
                containDeep({ id: log1,
                              title: 'title1',
                              durationEvent: false,
                              description: 'End of ' + log1,
                              start: `${new Date().getFullYear()}-08-16T19:16:13.752Z`, })
        })
    })
    describe('mergeSortedArrays', function () {
        it('number sorting test', function () {
            mergeSortedArrays((x, y) => x - y,
                              [0, 2, 4, 6, 8, 10],
                              [1, 3, 5, 7, 8, 9, 10, 11, 12]).
                should.containDeep([0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 10, 10, 11, 12]).
                and.have.length(15)
        })
    })
    describe('duraEventResolver', function () {
        it('complex test', function () {
            duraEventResolver((keyword) => (keyword === 'starter' ?
                                            starterLogs : keyword === 'ender' ?
                                            enderLogs : null))({ starterKeywords: ['starter'],
                                                                 enderKeywords: ['ender'],
                                                                 title: 'title1',
                                                                 classifyBy: ['$pid', 'session']}).
                should.containDeep([{ description: 'Start of ' + justStarterLog,
                                      durationEvent: false, }]).
                and.containDeep([{ description: 'End of ' + justEnderLog,
                                   durationEvent: false, }]).
                and.containDeep([{ description: log3 + '\n' + log7,
                                   durationEvent: true, }]).
                and.containDeep([{ description: log5 + '\n' + log6,
                                   durationEvent: true, }]).
                and.containDeep([{ description: log4 + '\n' + log8,
                                   durationEvent: true, }]).
                and.have.length(5)
        })
    })
})
