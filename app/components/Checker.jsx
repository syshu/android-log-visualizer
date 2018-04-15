import React, { Component } from 'react'

export default class Input extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInvalid: false,
    }
  }

  wrappedOnChange (...args) {
    this.setState({isInvalid: !this.props.isValid(...args)})
    this.props.onChange(...args)
  }

  render () {
    const {raw, isValid, onChange, ...props} = this.props
    if (typeof isValid !== 'function') throw new Error(`Need an isValid prop.`)
    if (typeof onChange !== 'function') throw new Error(`Need an onChange prop.`)
    const Raw = raw
    return (<div>
      <Raw {...props} onChange={this.wrappedOnChange.bind(this)} />
      {this.state.isInvalid?'不合规':null}
    </div>)
  }
}