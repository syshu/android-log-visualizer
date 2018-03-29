/**
 * @example <DURA rule={{type: string, id: string, meta: {starterKeywords: string[], enderKeywords: srting[], title: string, classifyBy: string[], tag: string}}} receiveRule={this.setState.bind(this)} />
 */

import React from 'react'
import { Input } from 'antd'
let Immutable = require('seamless-immutable').static
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
    <Input placeholder="title" value={rule.meta.title} onChange={({target}) => receiveRule({rule: setIn(rule, ['meta', 'title'], target.value)})} />
      <Input placeholder="starter keyword TODO keywords" value={rule.meta.starterKeywords[0]} onChange={({target}) => receiveRule({rule: setIn(rule, ['meta', 'starterKeywords'], [target.value])})} />
      <Input placeholder="ender keyword TODO keywords" value={rule.meta.enderKeywords[0]} onChange={({target}) => receiveRule({rule: setIn(rule, ['meta', 'enderKeywords'], [target.value])})} />
      <Input placeholder="classify by TODO strings" value={rule.meta.classifyBy[0]} onChange={({target}) => receiveRule({rule: setIn(rule, ['meta', 'classifyBy'], [target.value])})} />
      <Input placeholder="tag" value={rule.meta.tag} onChange={({target}) => receiveRule({rule: setIn(rule, ['meta', 'tag'], target.value)})} />
    </div>
  )
}

module.exports = DURA