require('should')
import combineResolvers from '../../app/scripts/combineResolvers.js'

const resolver1 = (getLogsByKeywords) => (meta) => {
    if (getLogsByKeywords === 'glbk1' && meta === 'meta1') {
        return 'events1'
    }
}

const resolver2 = (getLogsByKeywords) => (meta) => {
    if (getLogsByKeywords === 'glbk1' && meta === 'meta2') {
        return 'events2'
    }
}

describe('combineResolvers', function () {
    const getEventsByRule = combineResolvers({ 'RULE1': resolver1,
                                               'RULE2': resolver2})('glbk1')
    it('1', function () {
        getEventsByRule({ type: 'RULE1', meta: 'meta1' }).
            should.be.equal('events1')
        getEventsByRule({ type: 'RULE2', meta: 'meta2' }).
            should.be.equal('events2')
    })
})
