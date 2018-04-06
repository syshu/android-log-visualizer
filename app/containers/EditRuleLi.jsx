/**
 * @example <EditRuleLi rule={ruleID: string} />
 * @prop {string} rule The rule id, this connected component will fetch the rule object from the store by the rule id. It can be not recorded in the store, indicating that this is a new rule to be further added to the store.
 * @prop {(ruleID: string) => void} onRemove is the callback function that when the [delete] button is pressed, it will call up to the parent component to process this.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Card, Button } from 'antd'
import _ from 'underscore'
const { Option } = Select

/**
 * @prop rule: {id: string, type: string, meta: Object}
 * @prop {void => void} onRemove is passed and binded with the rule id in mapStateToProps, so this onRemove takes no parameter.
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

  deleteRule () {
    this.props.deleteRule(this.state.rule.id)
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
        <Button shape="circle" icon="close" style={{visibility: this.modified ? 'visible' : 'hidden'}} onClick={() => {this.modified = false}} />{this.props.isNewRule && this.modified && <span>按勾号保存新创建的时间定义</span>}
        {!this.props.isNewRule && <Button onClick={this.props.onRemove.bind(this)}>删除</Button>}
      </Card></li>
    )
  }
}

/**
 * @param {Object} ownProps: {rule: string}
 * @returns {Object} Wrapped component's props: {rule: {type: string, meta: Object}}
 */
function mapStateToProps (state, { rule, onRemove }) {
  const ruleObject = state.app.rules[rule]
  return {
    rule: ruleObject || { id: rule, type: undefined, meta: {} },
    isNewRule: !ruleObject,
    onRemove: onRemove.bind(null, rule),
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
export const Wrapped = EditRuleLi