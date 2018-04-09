/**
 * @type {React.StatelessComponent}
 * @example <DURA rule={...} receiveRule={(rule) => this.setState(...this.state, rule)} />
 * @prop {DuraRule} rule
 * @prop {(newRule: DuraRule) => void} receiveRule When a input box changed, this will be called.
 * @typedef {{type: string, id: string, meta: {starterKeywords: string[], enderKeywords: srting[], title: string, classifyBy: string[], tag: string}}} DuraRule
 */

import React from 'react'
import { Input } from 'antd'
const Immutable = require('seamless-immutable').static
/**
 * @function setIn
 * @param {Object} object
 * @param {string[]} path
 * @param {any} newValue
 * @return newObject
 */
let setIn = Immutable.setIn

function DURA ({ rule, receiveRule }) {
  return (
    <div className="detail">
      <Input placeholder="starter keyword TODO keywords" value={rule.meta.starterKeywords && rule.meta.starterKeywords[0]} onChange={({target}) => receiveRule(setIn(rule, ['meta', 'starterKeywords'], [target.value]))} />
      <Input placeholder="ender keyword TODO keywords" value={rule.meta.enderKeywords && rule.meta.enderKeywords[0]} onChange={({target}) => receiveRule(setIn(rule, ['meta', 'enderKeywords'], [target.value]))} />
      <Input placeholder="classify by TODO strings" value={rule.meta.classifyBy && rule.meta.classifyBy[0]} onChange={({target}) => receiveRule(setIn(rule, ['meta', 'classifyBy'], [target.value]))} />
      <Input placeholder="tag" value={rule.meta.tag} onChange={({target}) => receiveRule(setIn(rule, ['meta', 'tag'], target.value))} />
    </div>
  )
}

module.exports = DURA