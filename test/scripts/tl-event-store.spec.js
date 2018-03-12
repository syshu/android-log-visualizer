import {describe, it} from "eslint/lib/testers/event-generator-tester"
require('should')
import LogStore from '../../app/scripts/log-store'
import TLEventStore from '../../app/scripts/tl-event-store'

describe('TLEventStore', function() {
    const logLine1 = '08-16 19:16:12.752  2514  2514 I BetaNotificationManager: ' +
        'type: packing; id: 1002; size: 568980503; notificationLogId: 91612'
    const logLine2 = '08-16 19:16:13.752  2514  2514 I BetaNotificationManager: some message'
    const log1 = new LogStore.Log(logLine1)
    const log2 = new LogStore.Log(logLine2)
    describe('.parseInstEvent', function () {
        it('parse', function(){
            const instEvent = TLEventStore.parseInstEvent('title', log1)
            instEvent.should.have.properties({
                title: 'title',
                id: '2018-08-16T19:16:12.752Z',
                description: '2514 2514 I BetaNotificationManager: ' +
                'type: packing; id: 1002; size: 568980503; notificationLogId: 91612',
                start: '2018-08-16T19:16:12.752Z'
            })
            instEvent.should.not.have.property('durationEvent')
            instEvent.should.not.have.property('end')
        })
    })
    describe('.parseDuraEvent', function() {
        const parseDuraEvent = TLEventStore.parseDuraEvent
        it('with just starter log', function() {
            parseDuraEvent('title', log1).should.have.properties({
                title: 'Start of title',
                id: '2018-08-16T19:16:12.752Z',
                description: '2514 2514 I BetaNotificationManager: ' +
                'type: packing; id: 1002; size: 568980503; notificationLogId: 91612',
                start: '2018-08-16T19:16:12.752Z',
                durationEvent: undefined,
                end: undefined
            })
        })
        it('with starter and ender log', function() {
            parseDuraEvent('title', log1, log2).should.have.properties({
                title: 'title',
                id: '2018-08-16T19:16:12.752Z',
                description: '2514 2514 I BetaNotificationManager: ' +
                'type: packing; id: 1002; size: 568980503; notificationLogId: 91612',
                start: '2018-08-16T19:16:12.752Z',
                durationEvent: true,
                end: '2018-08-16T19:16:13.752Z'
            })
        })
        it('with just ender log', function () {
            parseDuraEvent('title', undefined, log1).should.have.properties({
                title: 'End of title',
                id: '2018-08-16T19:16:12.752Z',
                description: '2514 2514 I BetaNotificationManager: ' +
                'type: packing; id: 1002; size: 568980503; notificationLogId: 91612',
                start: '2018-08-16T19:16:12.752Z',
                durationEvent: undefined,
                end: undefined
            })
        })
    })
    describe('#fetchLogs', function () {
        it('e2e test', async function () {
            const tlEventStore = new TLEventStore()
            await tlEventStore.loadFiles(['./test/res/small-log-1.txt', './test/res/small-log-2.txt'])
            const logs = tlEventStore.fetchLogs('interceptKeyBeforeQueueing')
            logs.should.containDeep(
                [{raw: '08-16 19:11:36.266  1373 27308 D WindowManager: ' +
                'interceptKeyBeforeQueueing: modified'}]
            ).and.containDeep(
                [{raw: '08-16 19:11:39.266  1373 27308 D WindowManager: ' +
                'interceptKeyBeforeQueueing: key 4 , result : 1'}]
            ).have.length(2)
        })
    })
    describe('#fetchInstEvents', function () {
        it('e2e test', async function () {
            const tlEventStore = new TLEventStore()
            await tlEventStore.loadFiles(['./test/res/small-log-1.txt', './test/res/small-log-2.txt'])
            tlEventStore.fetchInstEvents('title', ['interceptKeyBeforeQueueing'])
                .should.containDeep([{
                    description: '1373 27308 D WindowManager: ' +
                    'interceptKeyBeforeQueueing: modified'
                }]).and.containDeep([{
                    description: '1373 27308 D WindowManager: ' +
                    'interceptKeyBeforeQueueing: key 4 , result : 1'
                }]).and.have.length(2)
            tlEventStore.fetchInstEvents('title', ['interceptKeyBeforeQueueing', 'result'])
                .should.containDeep([{
                    description: '1373 27308 D WindowManager: ' +
                    'interceptKeyBeforeQueueing: key 4 , result : 1'
                }]).and.have.length(1)
        })
    })
    describe('#fetchDuraEvents', function () {
        it('combined duration event', async function () {
            const tlEventStore = new TLEventStore()
            await tlEventStore.loadFiles(['./test/res/small-log-1.txt', './test/res/small-log-2.txt'])
            tlEventStore.fetchDuraEvents('title', ['NetworkSpeedManagerEx'], ['interceptKeyBeforeQueueing', 'result'])
                .should.containDeep([{
                    start: '2018-08-16T19:10:18.537Z',
                    end: '2018-08-16T19:11:39.266Z',
                    durationEvent: true
            }])
        })
        it('non-starter and non-ender event', async function () {
            const tlEventStore = new TLEventStore()
            await tlEventStore.loadFiles(['./test/res/small-log-1.txt', './test/res/small-log-2.txt'])
            tlEventStore.fetchDuraEvents('title', ['interceptKeyBeforeQueueing', 'result'], ['NetworkSpeedManagerEx'])
                .should.containDeep([{
                start: '2018-08-16T19:10:18.537Z',
                title: 'End of title'
            }, {
                start: '2018-08-16T19:11:39.266Z',
                title: 'Start of title'
            }])
        })
    })
    describe('#fetchEventsByRules', function () {
        it('basic', async function () {
            const tlEventStore = new TLEventStore()
            await tlEventStore.loadFiles(['./test/res/small-log-1.txt', './test/res/small-log-2.txt'])
            tlEventStore.fetchEventsByRules([{
                title:'title1', match:'interceptKeyBeforeQueueing'
            },{
                title:'title2', beginnerMatch:'NetworkSpeedManagerEx',
                enderMatch:['interceptKeyBeforeQueueing', 'result']
            }]).should.containDeep([{
                description: '1373 27308 D WindowManager: ' +
                'interceptKeyBeforeQueueing: modified'
            },{
                description: '1373 27308 D WindowManager: ' +
                'interceptKeyBeforeQueueing: key 4 , result : 1'
            },{
                start: '2018-08-16T19:10:18.537Z',
                end: '2018-08-16T19:11:39.266Z',
                durationEvent: true
            }])
        })
    })
})
