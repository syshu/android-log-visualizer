/**
 * Below are example actions.
 * Getting Result *
 * @typedef {{type: 'LOAD', payload?: Error, meta: {tab: string, logBase: string}, error: boolean}} Action.LOAD The result that is the logs successfully loaded.
 * @typedef {{type: 'FETCH', payload: Array, meta: {rule: {id: string}}}} Action.FETCH Worker returns result.
 * Rule Management *
 * @typedef {{type: 'SAVE_RULE', payload: RuleObject, meta: {ruleID: string}}} Action.SAVE_RULE
 * @typedef {{type: 'DELETE_RULE', meta: {ruleID: string}}} Action.DELETE_RULE
 */

import { static as Immutable, asMutable } from 'seamless-immutable'
const { merge, setIn } = Immutable
import _ from 'underscore'

const defaultState={
    app: { currentTab: '0',
           tabOrder: ['0'], },
    events: {},
    profiles: { default:{ 'output':{},
                          'set-mode':{}, },
                audio:{ 'output':{},
                        'set-mode':{hide:true}, }, },
    rules: {
        // 'output': {id:'output', title: 'output', beginnerMatch: 'startOutput', enderMatch: 'stopOutput'},
        // 'set-mode': {id:'set-mode', title: 'setMode', match: 'setMode'},
        'output': { id: 'output',
                    type: 'DURA',
                    meta:{ starterKeywords: ['startOutput'],
                           enderKeywords: ['stopOutput'],
                           title: 'output',
                           classifyBy: ['session'],
                           tag: 'APM_AudioPolicyManager', }},
        'set-mode': { id: 'set-mode',
                      type: 'INST',
                      meta:{ keywords:[ 'setMode' ],
                             title: 'set-mode',
                             tag: 'AudioManager', }},
    },
    tabs: {
        '0': { logBase:null, error:false, loading:false, currProfile:'default', autoFetch:true, worker: 0 },
    },
    logBases: {},
}

export default function (state = defaultState, { type, payload, meta, error }) {
    console.info('The store state is:', state)
    switch (type) {
        case 'FETCH':
            return setIn(state, ['events', meta.logBase, (meta.rule||meta.rules[0]).id], payload||'')
            /*{
                ...state,
                events:{
                    ...(state.events),
                    [meta.logBase]:{ ...(state.events[meta.logBase]), [(meta.rule||meta.rules[0]).id]: payload }
                },
            }*/
        case 'LOAD': { //payload:true/undefined meta.tab meta.logBase meta.worker
            const tabs = {...state.tabs}
            tabs[meta.tab]={
                ...state.tabs[meta.tab],
                logBase:meta.logBase||state.tabs[meta.tab].logBase,
                error:error&&payload,
                loading:!payload,
                loaded: !error&&!!payload,
            }
            return { ...state, tabs }
            /*return setIn(state, ['workers', meta.worker], {
                ...state.workers[meta.worker],
                logBase:meta.logBase||state.workers[meta.worker].logBase,
                error:error&&payload,
                loading:!payload,
                loaded:!error&&payload,
            })*/
        }
        case 'CHANGE_RULE_VISIBILITY'://payload:visibility, meta.rule:string, meta.profile:string
            //let newProfileObj = state.profiles[meta.profile]
            //const index = newProfileObj.findIndex(indNHide=>indNHide.ind===meta.rule)
            //newProfileObj[index] = {ind:meta.rule, hide:!payload }
            //return { ...state, profiles:{ ...state.profiles, [meta.profile]:newProfileObj } }
            return setIn(state, ['profiles', meta.profile, meta.rule], {hide: !payload})
        case 'SET_AUTO_FETCH'://payload:boolean, meta.tab:string
            //return { ...state, tabs:{ ...state.tabs, [meta.tab]:{ ...state.tabs[meta.tab], autoFetch:payload }}}
            return setIn(state, ['tabs', meta.tab, 'autoFetch'], payload)
        case 'BAD_REQUEST':
            return state
        case 'CHANGE_PROFILE'://payload:propName, meta.tab:tabID
            return setIn(state, ['tabs', meta.tab, 'currProfile'], payload)
        case 'SET_RULES_OF_PROFILE': { //payload:ruleIDs, meta.profile:currProfileName
            const newProfile = {}
            const oldProfile = state.profiles[meta.profile]
            for (let ruleID of payload) {
                newProfile[ruleID] = oldProfile[ruleID] || {hide: false}
            }
            return setIn(state, ['profiles', meta.profile], newProfile)
        }
        case 'SAVE_RULE':
            return setIn(state, ['rules', meta.ruleID], payload)
        case 'DELETE_RULE': {
            /*
            const newState = asMutable(_.clone(state))
            if (newState.rules[meta.ruleID]) {delete newState.rules[meta.ruleID]}
            else {console.warn('Attempting to delete a not existing rule from the store:', meta.ruleID)}
            for (let profile in newState.profiles) {
                if (newState.profiles[profile][meta.ruleID]) {delete newState.profiles[profile][meta.ruleID]}
            }
            return newState
            */
           const newState = {
               ...state,
               rules: _.omit(state.rules, meta.ruleID),
               profiles: _.mapObject(state.profiles, profile => _.omit(profile, meta.ruleID)),
           }
           return newState
        }
        default:
            return state
    }
}
