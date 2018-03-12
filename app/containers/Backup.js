import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Layout, Menu, Tooltip, Icon } from 'antd'
import SimileTimeline from '../components/Timeline'
import { remote, ipcRenderer } from 'electron'
import TLEventStore from '../scripts/tl-event-store'
import { send } from 'redux-electron-ipc'

const { Header, Content, Footer, Sider } = Layout

class LoggedIn extends Component {
    constructor(props) {
        super(props)
    }

    loadLog() {
        const logPath = remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
        /*
        await this.es.loadFords(logPath)
        const eventFilters = [
            {title: 'output', beginnerMatch: 'startOutput', enderMatch: 'stopOutput'},
            {title: 'setMode', match: 'setMode'}
        ]
        const events = this.es.fetchEventsByRules(eventFilters)
        this.setState({ events })
        */
        this.props.dispatchLoad(logPath)
    }

    render() {
        console.log('render props', this.props)
        const LoadedWorktable = (
            <div style={{ background: '#fff',
                padding: '0.5rem',
                flexGrow: 1,
            }}>
                <Tooltip placement="bottomRight" title={'选择文件/文件夹/压缩包'}>
                    <Button onClick={this.loadLog.bind(this)} style={{margin:'0.5rem'}} loading={this.props.loading}>
                        {this.props.loading?'Loading Log':'Load Log'}
                    </Button>
                </Tooltip>
                <SimileTimeline events={this.props.events} />
            </div>
        )
        const UnloadedWorktable = (
            <div style={{ background: '#fff',
                padding: '0.5rem',
                flexGrow: 1,
                display:'flex',
                justifyContent:'center',
                alignContent:'center',
                flexDirection:'column',
                alignItems:'center',
            }}>
                <span style={{textAlign:'center'}}>
                    选择一个或多个含有log的文件/文件夹来加载log，<br/>压缩包会被自动解压作为文件夹处理
                </span>
                <Button onClick={this.loadLog.bind(this)} style={{margin:'0.5rem'}} loading={this.props.loading}>
                    {this.props.loading?'Loading Log':'Load Log'}
                </Button>
            </div>
        )
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
                    <Content style={{ padding: '0.5rem', display:'flex', flexDirection:'column'}}>
                        <div style={{ background: '#fff',
                            padding: '0.5rem',
                            flexGrow: 1,
                            display:'flex',
                            justifyContent:'center',
                            flexDirection:'column',
                            alignItems:'center',
                        }}>
                            {this.props.isFirstTime?UnloadedWorktable:LoadedWorktable}
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

function logBaseSr(state):?string { return state.tabs[0].logBase }
function eventsSr(state) {
    const logBase=logBaseSr(state)
    return logBase?state.events[logBase]:[]
}

const mapStateToProps = (state)=>({
    logBase:logBaseSr(state),
    events:eventsSr(state),
    loading:state.tabs[0].loading,
    error:state.tabs[0].error,
    isFirstTime:!logBaseSr(state)
})

const axnC8rMap = {
    dispatchLoad: (logPathz)=>(dispatch, getState)=>{
        const action = { type:'LOAD', meta:{ logBase:logPathz } }
        ipcRenderer.send('event-store', action)
        dispatch(action)
    }
}

export default connect(mapStateToProps, axnC8rMap)(LoggedIn)