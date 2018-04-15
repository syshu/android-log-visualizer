import React, { Component } from 'react';
import { PropTypes } from 'prop-types'
import {
  Button, Card, Input, Checkbox, Icon, AutoComplete, message,
} from 'antd';
import storage from 'electron-json-storage'
import { connect } from 'react-redux'
import store from '../store'
import { shell } from 'electron'

export default class Login extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      loading: false,
      loadedRules: false,
      loadedProfiles: false,
    }
    this.users = ['user1', 'user2', 'user3'];
  }

  componentDidMount () {
    storage.has('rules', (error, hasKey) => {
      if (error) console.error(error)
      if (hasKey) {
        storage.get('rules', (error, data) => {
          if (error) console.error(error)
          store.dispatch({
            type: 'RESET_RULES',
            payload: data,
          })
          this.setState({loadedRules: true})
        })
      } else {this.setState({loadedRules: true})}
    })
    storage.has('profiles', (error, hasKey) => {
      if (error) console.error(error)
      if (hasKey) {
        storage.get('profiles', (error, data) => {
          if (error) console.error(error)
          store.dispatch({
            type: 'RESET_PROFILES',
            payload: data,
          })
          this.setState({loadedProfiles: true})
        })
      } else {this.setState({loadedProfiles: true})}
    })
    window.addEventListener('beforeunload', (event) => {
      console.log('onbeforeunload')
    })
  }

  render() {
    let { loadedProfiles, loadedRules } = this.state;
    return (
      <div className="launch-container">
        <h1>Android Log Visualizer</h1>
        <p>{(loadedProfiles && loadedRules) ? '配置载入完成' : '配置载入中'}</p>
        <Button disabled={!loadedProfiles || !loadedRules} onClick={this.login.bind(this)} type="primary">
          进入应用
        </Button>
        <p>获取帮助:<a href="#" onClick={this.openHelp.bind(this)}>https://github.com/syshu/android-log-visualizer/issues</a></p>
      </div>
    );
  }

  openHelp () {
    shell.openExternal('https://github.com/syshu/android-log-visualizer/issues')
  }

  login() {
    let { username, password } = this.state;
    // if (!username || !password) {
    //   message.error('用户名密码必填');
    //   this.setState({ loading: false });
    //   return;
    // }

    // message.success(`登录成功! 欢迎`);
    // 跳转页面 可传递参数
    this.props.router.push({ pathname: '/loggedin', state: { username, loggedIn: true } });
  }
}
