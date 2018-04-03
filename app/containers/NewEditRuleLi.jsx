/**
 * @example <NewEditRuleLi /> has no prop. It automatically generate an uuid to be the rule id.
 */

import { Wrapped}  from './EditRuleLi'
import React, { Component } from 'react'
import uuid from 'uuid'
import { connect } from 'react-redux'

function createDefaultProps (state, { rule }) {
  return {
    rule: {
      id: rule,
      type: 'INST',
      meta: {},
    },
  }
}

/**
 * @param {Function} dispatch
 * @param {Object} ownProps { rule } The rule id passed in.
 * @action SAVE_RULE
 */
function mapDispatchToProps (dispatch, { rule }) {
  return {
    saveRule: (ruleObject) => {dispatch({
      type: 'SAVE_RULE',
      payload: ruleObject,
      meta: {ruleID: rule},
    })}
  }
}

/**
 * @prop {string} rule ruleid
 */
const Connected = connect(createDefaultProps, mapDispatchToProps)(Wrapped)

export default class NewEditRuleLi extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uuid: uuid(),
    }
  }

  render () {
    return (
      <Connected rule={this.state.uuid} />
    )
  }
}