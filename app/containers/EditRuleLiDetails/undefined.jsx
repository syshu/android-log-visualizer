/**
 * This is for the situation that type is undefined, it will go to require('./EditRuleLiDetails/${type}') i.e. this module.
 * @type {React.StatelessComponent}
 * @example <undefined>
 */

import React from 'react'

function undefinedType () {
  return (
    <p>{'选择一个事件类型，然后定义该怎么找到它'}</p>
  )
}

module.exports = undefinedType