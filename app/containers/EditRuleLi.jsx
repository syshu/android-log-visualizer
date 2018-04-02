/**
 * @example <EditRuleLi rule={ruleID: string} />
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Card, Button } from 'antd'
import _ from 'underscore'
const { Option } = Select

/**
 * @prop rule: {type: string, meta: Object}
 */
class EditRuleLi extends Component {
  constructor (props) {
    super(props)
    this.state = { rule: props.rule }
  }

  get modified () {
    return !_.isEqual(this.props.rule, this.state.rule)
  }

  set modified (bool) {
    if (!bool) {
      this.setState({
        rule: this.props.rule,
      })
    } else {
      throw new Error('Should be false.')
    }
  }

  save () {
    this.props.saveRule(this.state.rule)
  }

  set ruleType (type) {
    this.setState({
      rule: {...this.state.rule, type: type},
    })
  }

  render () {
    return (
      <li><Card>
        <Select value={this.state.rule.type} onChange={(value) => {this.ruleType = value}}>
          <Option key="INST">简单事件</Option>
          <Option key="DURA">持续性事件</Option>
        </Select>
        {((RuleType) => (<RuleType rule={this.state.rule} receiveRule={(rule) => this.setState({rule})} />))(require('./EditRuleLiDetails/' + this.state.rule.type))}
        <Button shape="circle" icon="check" style={{visibility: this.modified ? 'visible' : 'hidden'}} onClick={this.save.bind(this)} />
        <Button shape="circle" icon="close" style={{visibility: this.modified ? 'visible' : 'hidden'}} onClick={() => {this.modified = false}} />
      </Card></li>
    )
  }
}

/**
 * @param {Object} ownProps: {rule: string}
 * @returns {Object} Wrapped component's props: {rule: {type: string, meta: Object}}
 */
function mapStateToProps (state, { rule }) {
  return {
    rule: state.app.rules[rule],
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

export default connect(mapStateToProps, mapDispatchToProps)(EditRuleLi)