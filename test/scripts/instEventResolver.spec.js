require('should')

import instEventResolver from '../../app/scripts/instEventResolver.js'

const log1 = '08-16 19:16:13.752  2514  2514 I Tag1: some message1'
const log2 = '08-16 19:16:13.753  2514  2514 I Tag1: some message2'
const log3 = '08-16 19:16:13.754  2514  2514 I Tag2: some message3'

describe('instEventResolver', function () {
    instEventResolver(keyword => keyword === 'message' ?
                      [log1, log2, log3] : [])({ keywords: ['message'],
                                                 title: 'title1', }).
        should.containDeep([{ title: 'title1',
                              id: log1,
                              description: log1,
                              start: '2018-08-16T19:16:13.752Z'}]).
        and.have.length(3)
})
