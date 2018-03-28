/**
 * High-order component to wrap a Component with a Modal.
 * This is an inherital style HOC.
 * 
 * @function modalize : (onOk: string, onCancel: string) => (wrapped: Component) => Component
 * @param {string} onOk The name of the function that wrapped component should have, while the OK button is clicked, that function will be invoked.
 * @param {string} onCancel The name of the function that wrapped component should have, while the Cancel button is clicked, that function will be invoked.
 * @param {Class<Component>} wrapped Wrapped component. It can 
 */

import React, { Component } from 'react'
import { Modal } from 'antd'

module.exports = (onOk, onCancel, visible) => (wrapped) => (
  class Modalized extends wrapped {
    render () {
      return (
        <Modal onOk={super[onOk]} onCancel={super[onCancel]}>
          {super.render.call(this)}
        </Modal>
      )
    }
  }
)