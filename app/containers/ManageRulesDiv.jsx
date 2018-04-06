/**
 * @example <ManageRulesDiv />
 * @prop {Array<string>} rules is the array of rule IDs, which can be uuid or specified string.
 * @state {Array<string>} rules
 */

import React, { Component } from 'react'
import EditRuleLi from './EditRuleLi'
import { connect } from 'react-redux'
import { Button } from 'antd'
import uuid from 'uuid'

class ManageRulesDiv extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rules: this.props.rules,
    }
  }

  addRule () {
    this.setState({
      rules: [...this.state.rules, uuid()]
    })
  }

  render () {
    return (
      <div className="manage-rules-div">
        <p>编辑事件定义</p>
        <ul>
          {this.state.rules.map((rule) => (<EditRuleLi key={rule} rule={rule} />))}
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

function mapDispatchToProps () {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageRulesDiv)