const rewire = require('rewire')
require('should')
const fs = require('fs-extra')
const fsp = require('pify')(require('fs'))
import LogStore, { Log } from '../../app/scripts/log-store'

describe('LogStore', function(){
    it('#loadFile', async function(){
        const ls = new LogStore()
        await ls.loadFile('test/res/log-store-test-1.txt')
        const file = ls.store['test/res/log-store-test-1.txt']
        file.should.equal('This is the first file.')
    })
    it('#loadFiles', async function(){
        const files = ['test/res/log-store-test-1.txt', 'test/res/log-store-test-2.txt']
        const ls = new LogStore()
        await ls.loadFiles(files)
        ls.store['test/res/log-store-test-1.txt']
            .should.equal('This is the first file.')
        ls.store['test/res/log-store-test-2.txt']
            .should.equal('This is the second file.\r\nThis is the second line.')
    })
    describe('.find', function() {
        const find = LogStore.find
        it('real log file test with single key', async function() {
            const str = await fsp.readFile('./test/res/applogcat-log', 'utf-8')
            const matches = find('BetaNotificationManager', str)
            matches.should.containEql('08-16 19:16:12.741  2514 20931 W ContextImpl: ' +
                'Calling a method in the system process without a qualified user: ' +
                'android.app.ContextImpl.sendBroadcast:1000 android.content.ContextWrapper.sendBroadcast:426 ' +
                'com.huawei.lcagent.service.BetaNotificationManager.sendBroadcast:83 ' +
                'com.huawei.lcagent.manual.CompressAsyncTask$PackManualLog.onPrePack:684 ' +
                'com.huawei.lcagent.util.PackLog.pack:43 ')
                .and.containEql('08-16 19:16:12.752  2514  2514 I BetaNotificationManager: ' +
                'type: packing; id: 1002; size: 568980503; notificationLogId: 91612')
                .and.have.length(2)
        })
        it('nothing', function() {
            find('notContainedKey', 'A sentence that does not contains the key.')
                .should.be.an.instanceOf(Array)
                .and.have.length(0)
        })
        it('in multiple txt (key is a string)', function() {
            find('key', ['key', 'have key!', 'doesn\'t have it.'])
                .should.eql(['key', 'have key!'])
        })
        it('in multiple txt (key is an array of single string)', function() {
            find(['key'], ['key', 'have key!', 'doesn\'t have it.'])
                .should.eql(['key', 'have key!'])
        })
        it('in multiple txt with multiple keys', function() {
            find(['have', 'key'], ['key', 'have key!', 'doesn\'t have it.'])
                .should.eql(['have key!'])
        })
        it('in single txt of multi-lines with multiple keys', function() {
            find(['have', 'key'], 'key\nhave key!\ndoesn\'t have it.')
                .should.eql(['have key!'])
        })
    })
    it('.parseTime', function(){
        const parseTime = LogStore.Log.parseTime
        const log = '08-16 19:16:12.743  1373  2319 I HwActivityManagerService: ' +
            'Split enqueueing broadcast [callerApp]:ProcessRecord{923dcd3 2514:com.huawei.imonitor/1000}'
        const time = parseTime(log)
        time.getActualMonth().should.be.equal(8)
        time.getDate().should.be.equal(16)
        time.getHours().should.be.equal(19)
        time.getMinutes().should.be.equal(16)
        time.getSeconds().should.be.equal(12)
        time.getMilliseconds().should.be.equal(743)
    })
    it('.getISOTime', function(){
        const getISO8601Time = LogStore.Log.parseISOTime
        const log = '08-16 19:16:12.743  1373  2319 I HwActivityManagerService: ' +
            'Split enqueueing broadcast [callerApp]:ProcessRecord{923dcd3 2514:com.huawei.imonitor/1000}'
        const isoTime = getISO8601Time(log)
        isoTime.should.be.equal('2018-08-16T19:16:12.743Z')
    })
    it('#loadFord', async function() {
        const ls = new LogStore()
        const dir = 'test/res/small-logs'
        await ls.loadFord(dir)
        ls.store.should.have.properties('test\\res\\small-logs\\small-log-1.txt',
            'test\\res\\small-logs\\small-log-2.txt')
    })
    it('#find', async function() {
        const ls = new LogStore()
        const files = ['test/res/log-store-test-1.txt', 'test/res/log-store-test-2.txt']
        await ls.loadFiles(files)
        const matches = ls.find('file')
        matches.should.containEql('This is the first file.')
            .and.containEql('This is the second file.')
            .and.have.length(2)
    })
    describe('.Log.resolve', function() {
        //const resolve = LogStore.__get__('resolve')
        const resolve = LogStore.Log.resolve
        it('startoutput log', function() {
            const log = resolve('08-16 19:13:46.675   629   629 I APM_AudioPolicyManager: ' +
                'startOutput() output 13, stream 3, session 15841')
            log.should.have.properties({
                time: '2018-08-16T19:13:46.675Z',
                pid: '629',
                tid: '629',
                priority: 'I',
                tag: 'APM_AudioPolicyManager',
                msg: 'startOutput() output 13, stream 3, session 15841'
            })
        })
        it('tag with multiple spaces at tail', function() {
            const log = resolve('08-16 19:08:59.655   629   798 D asd     : ' +
                '[asd_proc_hal_data],hal data soundness: L[10592],R[10368]')
            log.should.have.properties({
                tag: 'asd',
                msg: '[asd_proc_hal_data],hal data soundness: L[10592],R[10368]'
            })
        })
        it('tag includes special character', function() {
            const log = resolve('08-16 19:08:59.045  2856  2984 W trace_@_31_5_@: ' +
                '@_31_5_9_@ isStarted:false|isTimeout:false')
            log.should.have.properties({
                tag: 'trace_@_31_5_@',
                msg: '@_31_5_9_@ isStarted:false|isTimeout:false'
            })
            const log2 = resolve('08-16 19:08:58.299 16355 16668 E MailApi<14196>: ' +
                'MailFolderBDInMap is null: ')
            log2.should.have.property('tag', 'MailApi<14196>')
        })
    })
    describe('.Log.seekVal', function() {
        const seekValue = LogStore.Log.seekVal
        it('colon', function() {
            const str = 'the user type is :  3'
            seekValue('user type is', str).should.equal('3')
        })
        it('equal', function() {
            const str = 'Relayout Window{f7738d3 u0 com.huawei.betaclub/' +
                'com.huawei.betaclub.feedback.description.common.SpecialFeatureDescriptionActivity}: ' +
                'viewVisibility=8 req=1080x2160 WM.LayoutParams{(0,0)(fillxfill) ' +
                'sim=#112 ty=1 fl=#81810100 hwFlags=#10 isEmuiStyle=1 statusBarColor=#ff1a93d2 ' +
                'navigationBarColor=#fffcfcfc wanim=0x10303ea vsysui=0x600 needsMenuKey=2}'
            seekValue('wanim', str).should.equal('0x10303ea')
            seekValue('navigationBarColor', str).should.equal('#fffcfcfc')
        })
        it('startoutput log', function() {
            const str = 'startOutput() output 13, stream 3, session 15841'
            seekValue('session', str).should.equal('15841')
        })
        it('Log object', function() {
            const log = new LogStore.Log('08-16 19:13:46.675   629   629 I APM_AudioPolicyManager: ' +
                'startOutput() output 13, stream 3, session 15841')
            log.should.have.properties({
                time: '2018-08-16T19:13:46.675Z',
                pid: '629',
                tid: '629',
                priority: 'I',
                tag: 'APM_AudioPolicyManager',
                msg: 'startOutput() output 13, stream 3, session 15841'
            })
        })
    })
    describe('.Log.valueOf', function() {
        const Log1 = Object.setPrototypeOf({time: '2018-08-16T19:13:46.675Z'}, LogStore.Log.prototype)
        const Log2 = Object.setPrototypeOf({time: '2018-08-16T20:13:46.675Z'}, LogStore.Log.prototype)
        it('minus', function() {
            (Log2-Log1).should.equal(3600000)
        })
        it('larger than', function() {
            (Log2>Log1).should.equal(true)
        })
    })
})
