import reducer from '../../app/reducers/appr';
import {describe, it} from "eslint/lib/testers/event-generator-tester"

describe('sub-reducer events', function () {
    it('action FETCH succeed', function () {
        reducer({ events:{ logFolder1: { '123': '' } } },
                { type: 'FETCH',
                  meta:{ logBase: 'logFolder1',
                         rule:{ id: 123 },
                         tab: '0', },
                  payload: ['evt1','evt2'], }).
            should.containDeep({ events:{ logFolder1:{ '123': ['evt1', 'evt2'] } } })
    })
    it('action FETCH failed', function () {
        reducer({ events: {} }, { type:'FETCH',
                                  error:true,
                                  meta:{ logBase:'logFolder1',
                                         rule:{id:123},
                                         tab:'0', },
                                  payload:new Error('error'), }).
            should.containDeep({ events:{ logFolder1:{ '123': {message:'error'} } } })
    })
    it('action FETCH pending', function () {
        reducer({events: {}}, { type:'FETCH',
                                error:true,
                                meta:{ logBase:'logFolder1',
                                       rule:{id:123},
                                       tab:'0', } }).
            should.containDeep({ events:{ logFolder1: {'123':''} } })
    })
})
describe('sub-reducer tabs', function () {
    it('action LOAD pending', function () {
        reducer({ tabs:{['0']:{logBase:null, loaded: true}} },
                { type:'LOAD', meta:{ logBase:'addr', tab:'0' } }).
            should.containDeep({tabs: {['0']:{ logBase:'addr',
                                               loading:true,
                                               loaded:false, } } })
    })
    it('action LOAD fulfilled', function () {
        reducer({ tabs:{['0']:{logBase:null, loaded:false}} },
                { type:'LOAD',
                  meta:{ logBase:'addr', tab:'0' },
                  payload:true }).
            should.containDeep({ tabs:{ ['0']:{ logBase:'addr',
                                                loading:false,
                                                loaded:true, }}})
    })
    it('action LOAD rejected', function () {
        reducer({ tabs:{['0']:{ logBase:null, loaded:true }} },
                { type:'LOAD',
                  meta:{ logBase:'addr', tab:'0' },
                  payload:new Error(),
                  error:true }).
            should.containDeep({tabs: {['0']:{ logBase:'addr',
                                                loaded:false,
                                                loading:false,
                                                error:{message:''}, } } })
    })
    it('action SET_AUTO_FETCH', function () {
        reducer({ tabs:{['0']:{autoFetch:false}} },
                { type:'SET_AUTO_FETCH', meta:{ tab:'0' }, payload:true }).
            should.containDeep({ tabs:{['0']:{autoFetch:true}} })
    })
    it('action CHANGE_PROFILE', function () {
        reducer({ tabs:{['0']:{currProfile:'profile1'}}},
                { type:'CHANGE_PROFILE', payload:'profile2', meta:{tab:'0'}}).
            should.containDeep({tabs:{ ['0']:{currProfile:'profile2'}}})
    })
})
describe('sub-reducer profiles', function () {
    it('CHANGE_RULE_VISIBILITY', function () {
        reducer({ profiles:{profile1:{ rule1:{ hide: false },
                                       rule2:{ hide: false },
                                       rule3:{ hide: true } } } },
                { type:'CHANGE_RULE_VISIBILITY',
                  payload:false,
                  meta:{ profile:'profile1', rule:'rule2' } }).
            should.containDeep({ profiles:{profile1:{ rule1:{ hide: false },
                                                      rule2:{ hide: true },
                                                      rule3:{ hide: true }, } } })
    })
    it('SET_RULES_OF_PROFILE', function () {
        reducer({ profiles:{ profile1:{ rule1:{ hide: false },
                                        rule2:{ hide: true },
                                        rule3:{ hide: false }, } } },
                { type: 'SET_RULES_OF_PROFILE',
                  payload: ['rule1', 'rule2', 'rule4', 'rule5'],
                  meta: { profile: 'profile1' } }).
            should.containDeep({ profiles:{ profile1:{ rule1:{ hide: false },
                                                       rule2:{ hide: true },
                                                       rule4:{ hide: false },
                                                       rule5:{ hide: false }, } } })
    })
})
describe('sub-reducer rules', function () {
    it('SAVE_RULE change existing rule', function () {
        reducer({rules:
            {['rule1']:
                {content1: 'content of rule1'},
            }
        }, {
            type: 'SAVE_RULE',
            payload: {content2: 'modified content'},
            meta: {ruleID: 'rule1'},
        })
            .should.containDeep({
            rules: {
                rule1: { content2: 'modified content' },
            }
        })
    })
    it('SAVE_RULE create new rule', function () {
        reducer({rules:{
            rule1: {},
        }}, {
            type: 'SAVE_RULE',
            payload: {content: 'content'},
            meta: {ruleID: 'newRule'},
        })
            .should.containDeep({rules:{
                newRule: {content: 'content'},
        }})
    })

    it('DELETE_RULE', function () {
        reducer({
            rules: {
                rule1: {}, //To be deleted.
                rule2: {},
            },
            profiles: {
                profile1: { rule1: {}, rule2: {}, }, //1 rule will be deleted.
                profile2: {rule3: {}}, //None will be deleted.
                profile3: {rule1: {}}, //Will delete 1 rule to be an empty object.
            }
        }, { type: 'DELETE_RULE', meta: {ruleID: 'rule1'}})
        .should.containDeep({
            rules: { rule1: undefined, rule2: {} },
            profiles: {
                profile1: {rule1: undefined, rule2: {}},
                profile2: {rule3: {}},
                profile3: {rule1: undefined},
            }
        })
    })
})