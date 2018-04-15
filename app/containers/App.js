import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <QueueAnim>
        <div key={this.props.children.type.name} className="root-body maxcontant">
          {this.props.children}
        </div>
      </QueueAnim>
    );
  }
}

