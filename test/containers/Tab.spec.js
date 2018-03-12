import Tab, { actionCreatorMap } from '../../app/containers/Tab.jsx'
import {describe, it} from "eslint/lib/testers/event-generator-tester"
const { load, changeRuleVisibility, setAutoFetch, fetch, setRulesOfProfile } = actionCreatorMap

describe('Tab actionCreatorMap', function() {
    it('fetch', function() {
        fetch({ title: 'rule1' }).should.containDeep({
            type:'FETCH', payload: undefined, error: undefined, meta:{ rule:{ title: 'rule1' } }
        })
    })
    it('setRulesOfProfile', function () {
        setRulesOfProfile('profile1', [1, 2, 4, 5]).
            should.containDeep({type:'SET_RULES_OF_PROFILE',
                                payload:[1, 2, 4, 5],
                                error:undefined,
                                meta:{profile:'profile1'}})
    })
})
