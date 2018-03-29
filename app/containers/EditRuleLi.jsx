/**
 * @example <EditRuleLi rule={ruleID: string} />
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Card } from 'antd'
const { Option } = Select

/**
 * @prop rule: {type: string, meta: Object}
 */
class EditRuleLi extends Component {
  constructor (props) {
    super(props)
    this.state = { rule: props.rule }
  }

  render () {
    return (
      <li><Card>
        <Select defaultValue={this.props.rule.type} onChange={null}>
          <Option key="INST">简单事件</Option>
          <Option key="DURA">持续性事件</Option>
        </Select>
        {((RuleType) => (<RuleType rule={this.state.rule} receiveRule={this.setState.bind(this)} />))(require('./EditRuleLiDetails/' + this.props.rule.type))}
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

export default connect(mapStateToProps)(EditRuleLi)