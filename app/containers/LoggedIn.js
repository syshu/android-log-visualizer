import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Layout, Menu, Tooltip, Icon, Tabs } from 'antd'
import SimileTimeline from '../components/Timeline'
import { remote, ipcRenderer } from 'electron'
import { send } from 'redux-electron-ipc'
import Tab from './Tab'

const { Header, Content, Footer, Sider } = Layout
const { TabPane } = Tabs

class LoggedIn extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
          <Layout className="layout" style={{position:'fixed', top:0, right:0, bottom:0, left:0}}>
              <Sider
                  breakpoint="lg"
                  collapsedWidth="0"
                  onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
              >
                  <div className="logo" />
                  <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                      <Menu.Item key="1">
                          <Icon type="user" />
                          <span className="nav-text">nav 1</span>
                      </Menu.Item>
                      <Menu.Item key="2">
                          <Icon type="video-camera" />
                          <span className="nav-text">nav 2</span>
                      </Menu.Item>
                      <Menu.Item key="3">
                          <Icon type="upload" />
                          <span className="nav-text">nav 3</span>
                      </Menu.Item>
                      <Menu.Item key="4">
                          <Icon type="user" />
                          <span className="nav-text">nav 4</span>
                      </Menu.Item>
                  </Menu>
              </Sider>
              <Layout>
                  <Content style={{ padding: '12px', display:'flex', flexDirection:'column'}}>
                      <div style={{ background: '#fff',
                          padding: '24px',
                          flexGrow: 1,
                          justifyContent:'center',
                          flexDirection:'column',
                      }}>
                          <Tabs
                              onChange={null}
                              activeKey={'0'}
                              type="editable-card"
                              onEdit={null}
                          >
                              <TabPane tab={'tab1'} key={'0'} closable={false}><Tab id={'0'} /></TabPane>
                          </Tabs>
                      </div>
                  </Content>
                  <Footer style={{ textAlign: 'center' }}>
                      Developed with Ant Design
                  </Footer>
              </Layout>
          </Layout>
        )
    /*
      return (
      <div>
        <h2>Logged in as {this.props.location.state.username}</h2>
          <h3>another line.</h3>
        <Button onClick={() => {
          this.props.router.goBack();
        }}>返回</Button>
      </div>
    );
    */
    }
}

export default LoggedIn