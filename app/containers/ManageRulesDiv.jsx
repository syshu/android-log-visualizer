/**
 * @example <ManageRulesDiv />
 * @prop {Array<string>} rules is the array of rule IDs, which can be uuid or specified string.
 * @state {Array<string>} rules
 */

import React, { Component } from 'react'
import EditRuleLi from './EditRuleLi'
import { connect } from 'react-redux'
import { Button, Card } from 'antd'
import uuid from 'uuid'

class ManageRulesDiv extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rules: this.props.rules,
    }
  }

  /**
   * Add a rule card for further saving.
   */
  addRule () {
    this.setState({
      rules: [...this.state.rules, uuid()]
    })
  }

  /**
   * Delete from the store and the dialog.
   * @param {string} ruleID is the rule id you want to delete.
   */
  deleteRule (ruleID) {
    this.setState({
      rules: this.state.rules.filter((rule) => rule !== ruleID)
    })
    this.props.deleteRule(ruleID)
  } //TODO

  render () {
    return (
      <div className="manage-rules-div">
        <p>编辑事件定义</p>
        <ul>
          {this.state.rules.map((rule) => (<li key={rule}><EditRuleLi key={rule} rule={rule} onRemove={this.deleteRule.bind(this)}/></li>))}
        </ul>
        <Button onClick={this.addRule.bind(this)} >新增事件</Button>
      </div>
    )
  }

}

/**
 * @param {undefined} ownProps Not used.
 */
function mapStateToProps (state, ownProps) {
  return {
    rules: Object.keys(state.app.rules),
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    deleteRule: (ruleID) => {dispatch({
      type: 'DELETE_RULE',
      meta: {ruleID: ruleID}
    })},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageRulesDiv)