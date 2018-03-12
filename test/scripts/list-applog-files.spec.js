const rewire = require('rewire')
require('should')
const fs = require('fs-extra')

const lib = rewire('../../app/scripts/list-applog-files.js')

describe.skip('list-applog-files', function() {
    describe('listDir', function() {
        it('isArchive', function () {
            const isArchive = lib.__get__('isArchive')
            isArchive('\\asrt\\arst\\1.zip').should.be.equal(true)
            isArchive('\\art\\arst\\1.').should.be.equal(false)
            isArchive('/arst/1.gz').should.be.equal(true)
            isArchive('gz').should.be.equal(false)
            isArchive('1.zip\\arst').should.be.equal(false)
        })
        it('listArchive', function() {
            const expected = [ 'test\\res\\whatever.tar.gz.extract\\app.logcat',
                'test\\res\\whatever.tar.gz.extract\\_applogcat_.txt'].sort().toString()
            const listArchive = lib.__get__('listArchive')
            return listArchive('./test/res/whatever.tar.gz')
                .then(ret=>{ret.sort().toString().should.be.equal(expected)})
        })
        it('listDir', function() {
            const expected = [ 'test\\res\\logdir\\app.logcat',
                'test\\res\\logdir\\log.zip.extract\\app.logcat',
                'test\\res\\logdir\\log.zip.extract\\whatever.tar.gz.extract\\app.logcat',
                'test\\res\\logdir\\log.zip.extract\\whatever.tar.gz.extract\\_applogcat_.txt',
                'test\\res\\logdir\\log.zip.extract\\whatever2.tar.gz.extract\\app.logcat',
                'test\\res\\logdir\\log.zip.extract\\whatever2.tar.gz.extract\\_applogcat_.txt',
                'test\\res\\logdir\\log.zip.extract\\_applogcat_.txt',
                'test\\res\\logdir\\_applogcat_.txt' ].sort().toString()
            const listDir = lib.__get__('listDir')
            return listDir('./test/res/logdir')
                .then(ret=>{ret.sort().toString().should.be.equal(expected)})
        })
        after('Delete extracted files.', function(done){
            fs.remove('./test/res/logdir/log.zip.extract', done)
        })
        after('Delete extracted files.', function(done){
            fs.remove('./test/res/whatever.tar.gz.extract', done)
        })
    })
    it('isApplogFile', async function() {
        const isApplog = lib.__get__('isApplogFile');
        const result1 = await isApplog('./test/res/log-store-test-1.txt')
        result1.should.equal(false)
        const result2 = await isApplog('./test/res/applogcat-log.2')
        result2.should.equal(true)
    })
    it('listApplogFiles', async function() {
        const alfs = await lib('./test/res/is-applog-test')
        alfs.should.containEql('test\\res\\is-applog-test\\eventslogcat-log')
            .and.containEql('test\\res\\is-applog-test\\applogcat-log')
            .and.containEql('test\\res\\is-applog-test\\applogcat-log-0.tar.gz.extract\\applogcat-log.1')
    })
    after('Delete extracted files.', function(done){
        fs.remove('./test/res/is-applog-test/applogcat-log-0.tar.gz.extract', done)
    })
})