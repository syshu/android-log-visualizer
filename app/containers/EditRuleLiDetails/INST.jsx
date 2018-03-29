/**
 * @example <INST rule={{type: string, id: string, meta: {keywords: string[], title: string, tag: string}}} />
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

let INST = ({rule, receiveRule}) => (
  <div className="detail">
    <Input placeholder="title" value={rule.meta.title} onChange={({target}) => receiveRule({rule: setIn(rule, ['meta', 'title'], target.value)})} />
    <Input placeholder="keyword TODO keywords" value={rule.meta.keywords[0]} onChange={({target}) => receiveRule({rule: setIn(rule, ['meta', 'keywords'], [target.value])})} />
    <Input placeholder="tag" value={rule.meta.tag} onChange={({target}) => receiveRule({rule: setIn(rule, ['meta', 'tag'], target.value)})} />
  </div>
)

module.exports = INST