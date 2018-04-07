import store from './store'

export function selectRuleById (id) {
  return store.getState().app.rules[id]
}

export function selectRuleTitleById (id) {
  return selectRuleById(id).meta.title
}