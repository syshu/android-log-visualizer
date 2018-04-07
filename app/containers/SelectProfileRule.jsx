/**
 * Select what rule a profile should contain.
 * @type {ConnectedComponent}
 * @prop {string} profileId is the id of a profile.
 * @prop {Object} style
 */

import React, { Component } from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
import { selectRuleTitleById } from '../selectors'

/**
 * @type {React.StatelessComponent}
 * @prop {string[]} allRules is all the rules.
 * @prop {string[]} profileRules is the rules of specified profile.
 * @prop {string[] => void} onChange
 */
function SelectProfileRule ({ allRules, profileRules, onChange, style }) {
  return (
    <Select mode="multiple" placeholder="选择该profile应该包含的rule" value={profileRules} onChange={onChange} style={style}>
      {allRules.map(ruleID => (<Select.Option key={ruleID}>{selectRuleTitleById(ruleID)}</Select.Option>))}
    </Select>
  )
}

function mapStateToProps (state, { profileId, style }) {
  return {
    allRules: Object.keys(state.app.rules),
    profileRules: Object.keys(state.app.profiles[profileId]),
    style,
  }
}

function mapDispatchToProps (dispatch, { profileId }) {
  return {
    onChange: (ruleIds) => {
      dispatch({
        type: 'SET_RULES_OF_PROFILE',
        payload: ruleIds,
        meta: {profile: profileId},
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectProfileRule)