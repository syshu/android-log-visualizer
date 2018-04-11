/**
 * @example <EditRuleLi rule={ruleID: string} />
 * @prop {string} rule The rule id, this connected component will fetch the rule object from the store by the rule id. It can be not recorded in the store, indicating that this is a new rule to be further added to the store.
 * @prop {(ruleID: string) => void} onRemove is the callback function that when the [delete] button is pressed, it will call up to the parent component to process this.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Card, Button, Collapse, Input } from 'antd'
import Checker from '../components/Checker'
import _ from 'underscore'
import eventTypes from './EditRuleLiDetails/eventTypes';
const { Option } = Select
const Immutable = require('seamless-immutable').static
const setIn = Immutable.setIn
const Panel = Collapse.Panel

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
      <Collapse borderd={false}><Panel header={`${this.props.rule.type?eventTypes[this.props.rule.type].displayName:'新建事件'}: ${this.props.rule.meta.title || '设置事件的搜索规则后保存'}${this.modified?' (未保存)':''}`}>
        <section>
          <label>类型</label>
          <Select value={this.state.rule.type} onChange={(value) => {this.ruleType = value}} placeholder="事件类型" style={{minWidth: '8em'}}>
            {Object.keys(eventTypes).map((key) => (<Option key={key}>{eventTypes[key].displayName}</Option>))}
          </Select>
          <label>名称</label>
          <Input placeholder="title" value={this.state.rule.meta.title} onChange={({target}) => {this.setState((state) => ({rule: setIn(state.rule, ['meta', 'title'], target.value)}))}} />
        </section>
        <section>
        {((RuleType) => (<RuleType rule={this.state.rule} receiveRule={(rule) => this.setState({rule})} />))(require('./EditRuleLiDetails/' + this.state.rule.type))}
        <Button shape="circle" icon="check" style={{visibility: this.modified ? 'visible' : 'hidden'}} onClick={this.save.bind(this)} />
        <Button shape="circle" icon="close" style={{visibility: this.modified ? 'visible' : 'hidden'}} onClick={() => {this.modified = false}} />{this.props.isNewRule && this.modified && <span>按勾号保存新创建的事件定义</span>}
        {!this.props.isNewRule && <Button onClick={this.props.onRemove.bind(this)}>删除</Button>}
        </section>
      </Panel></Collapse>
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