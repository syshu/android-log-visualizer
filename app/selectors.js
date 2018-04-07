import store from './store'

export function selectRuleById (id) {
  return store.getState().app.rules[id]
}

export function selectRuleTitleById (id) {
  return selectRuleById(id).meta.title
}

export function isProfileExist (name) {
  const profileNames = Object.keys(store.getState().app.profiles)
  return profileNames.includes(name)
}