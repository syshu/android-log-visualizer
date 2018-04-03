/**
 * @example <ManageRulesDiv />
 */

import React, { Component } from 'react'
import EditRuleLi from './EditRuleLi'
import { connect } from 'react-redux'
import NewEditRuleLi from './NewEditRuleLi'

class ManageRulesDiv extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="manage-rules-div">
        <h1>编辑事件定义</h1>
        <ul>
          {this.props.rules.map((rule) => (<EditRuleLi key={rule} rule={rule} />))}
          <NewEditRuleLi />
        </ul>
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