import tlEventDiscoverer from '../../app/scripts/tlEventDiscoverer.js'

describe('tlEventDiscoverer', function () {
    let discoverEventsByRule
    it('load', async function () {
        discoverEventsByRule = await tlEventDiscoverer('./test/res/small-logs')
        discoverEventsByRule.should.be.an.instanceof(Function)
        discoverEventsByRule.length.should.be.equal(1)
    })
    it('inst event without tag', function () {
        const rule = { id: 'NetworkSpeedManagerEx',
                       type: 'INST',
                       meta:{ keywords:[ 'NetworkSpeedManagerEx' ],
                              title: 'NetworkSpeedManagerEx',
                              tag: undefined, }}
        discoverEventsByRule(rule).should.containDeep([{
            start: '2018-08-16T19:10:18.537Z',
        }])
    })
    it('inst event with tag', function () {
        const rule = { id: 'NetworkSpeedManagerEx',
                       type: 'INST',
                       meta:{ keywords:[ 'NetworkSpeedManagerEx' ],
                              title: 'NetworkSpeedManagerEx',
                              tag: 'NetworkSpeedManagerEx', }}
        discoverEventsByRule(rule).should.containDeep([{
            start: '2018-08-16T19:10:18.537Z',
        }])
    })
    it('dura event', function () {
        const rule = { id: 'output',
                    type: 'DURA',
                    meta:{ starterKeywords: ['modified'],
                           enderKeywords: ['result'],
                           title: 'output',
                           classifyBy: undefined,
                           tag: undefined, }}
        discoverEventsByRule(rule).should.containDeep([{
            start: '2018-08-16T19:11:36.266Z',
            end: '2018-08-16T19:11:39.266Z',
            durationEvent: true,
        }])
    })
})
