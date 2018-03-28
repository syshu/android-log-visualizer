import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Layout, Menu, Tooltip, Icon, Alert, Row, Col, Select, Checkbox, Switch, Tag, Badge, Modal } from 'antd'
import SimileTimeline from '../components/Timeline'
import { remote, ipcRenderer } from 'electron'
import TLEventStore from '../scripts/tl-event-store'
import { send } from 'redux-electron-ipc'
import { createAction, createActions } from 'redux-actions'
import RuleTag from '../components/RuleTag'
import ManageRulesDiv from './ManageRulesDiv'

const { Header, Content, Footer, Sider } = Layout
const { Option } = Select
const CheckboxGroup = Checkbox.Group
const CheckableTag = Tag.CheckableTag

class Tab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            everLoaded: false,
            addRuleVisible: false,
        }
    }

    dispatchLoad(logPath) {
        ipcRenderer.send('event-store', { type:'LOAD', meta:{ logBase:logPath, tab:this.props.tabID } })
        this.props.load(this.props.tabID, logPath)
        //return this.props.dispatchLoad(this.props.tabID, logPathz)
    }

    fetch(rule) {
        //this.props.fetch(rule)
        ipcRenderer.send('event-store', createAction('FETCH', ()=>undefined, (rule:Object)=>({ rule }))(rule))
    }

    loadLog() {
        //const logPath = remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
        const logPaths = remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory']})
        if (!logPaths) return
        const logPath = logPaths[0]
        /*
           await this.es.loadFords(logPath)
           const eventFilters = [
           {title: 'output', beginnerMatch: 'startOutput', enderMatch: 'stopOutput'},
           {title: 'setMode', match: 'setMode'}
           ]
           const events = this.es.fetchEventsByRules(eventFilters)
           this.setState({ events })
         */
        this.dispatchLoad(logPath)
    }

    resolveFetchingStatus (rule:{ id:number }|number) {
        const id = rule.id || rule
        if (!this.props.events) return 'default'
        const events = this.props.events[id]
        return events ? 'success' : events===''? 'warning' : 'default'
    }

    componentWillReceiveProps (nextProps) {
        this.setState(state=>({ everLoaded: state.everLoaded || nextProps.loaded }))
    }

    componentDidUpdate () {
        if (this.props.autoFetch && this.props.loaded && this.getStatusOfFetching()==='unloaded') {
            let toFetch:{fid:number, title:string}
            if (!this.props.events) toFetch = this.getCurrProfsRules()[0]
            else toFetch = this.getCurrProfsRules().find(rule=>!this.props.events[rule.id])
            if (toFetch) {
                this.fetch(toFetch)
            }
        }
    }

    getEventsByRule (rule:{id:number, title:string}|number):?Array<Event> {
        return this.props.events(rule.id || rule)
    }

    getCurrProfile():Object {
        return this.props.profiles[this.props.currProfileName]
    }

    getCurrProfsRules():Array<{id:string, title:string}> {
        return Object.keys(this.getCurrProfile())
            .map(ruleID=>this.props.ruleObjs[ruleID])
    }

    getUnhiddenRules():Array<{id:string, title:string}> {
        return this.getCurrProfsRules().filter(rule=>!this.getCurrProfile()[rule.id].hide)
    }

    getUnhiddenEvents():Array<Event> {
        if (this.props.events === undefined) return []
        const unhiddenEventss = this.getUnhiddenRules()
            .map(rule=>rule.id)
            .map(ruleID=>this.props.events[ruleID])
            .filter(events=>(events instanceof Array))
        return [].concat(...unhiddenEventss)
    }

    getStatusOfEvents(rule:{id:number, title:string}|number):string {
        const ruleID = rule.id || rule
        const events = this.props.events[ruleID]
        if (events === undefined) return 'unloaded'
        else if (events instanceof Array && events.length > 0) return 'loaded'
        else if (events === undefined) return 'unloaded'
        else return 'loading'
    }

    getStatusOfFetching() {
        if (this.props.events === undefined) return 'unloaded'
        else if (this.getCurrProfsRules().some(rule=>(this.getStatusOfEvents(rule)==='loading'))) return 'loading'
        else if (this.getCurrProfsRules().every(rule=>(this.getStatusOfEvents(rule)==='loaded'))) return 'loaded'
        else return 'unloaded'
    }

    changeProfile (profile:number) {
        this.props.changeProfile(this.props.tabID, profile)
    }

    render() {
        return (
            <div style={{
                background: '#fff',
                padding: '0.5rem',
                flexGrow: 1,
                minHeight: 400,
            }}>
                <Alert
                    message="点击Load Log按钮来加载日志"
                    description="选择一个或多个含有log的文件/文件夹来加载log，压缩包会被自动解压作为文件夹处理"
                    type="info"
                    showIcon
                    style={{display:this.state.everLoaded ? 'none' : 'block'}}
                />
                <Row gutter={8} style={{margin:'8px 0px'}}>
                    <Col span={6}>
                        <Tooltip placement="bottomRight" title={'选择文件/文件夹/压缩包'}>
                            <Button onClick={this.loadLog.bind(this)} style={{width:'100%'}} loading={this.props.loading} type="primary">
                                {this.props.loading ? 'Loading...' : 'Load Log'}
                            </Button>
                        </Tooltip>
                    </Col>
                    <Col span={6}>
                        <Select
                            defaultValue={this.props.currProfileName}
                            onChange={::this.changeProfile}
                            style={{ width: '100%' }}
                        >
                            {Object.keys(this.props.profiles).map(profName=>(<Option key={profName}>{profName}</Option>))}
                        </Select>
                    </Col>
                    <Col span={12}>
                        <Select
                            mode="multiple"
                            placeholder="选择该profile应该包含的rule"
                            defaultValue={this.getCurrProfsRules().map(rule=>rule.id)}
                            onChange={(ruleIDs)=>{this.props.setRulesOfProfile(this.props.currProfileName, ruleIDs)}}
                            style={{ width: '100%' }}
                            
                        >
                            {Object.keys(this.props.ruleObjs).map(ruleID=>(
                                <Option key={ruleID}>{ruleID}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                自动搜索事件
                <Switch defaultChecked={true}
                        onChange={status => this.props.setAutoFetch(this.props.tabID, status)}
                        style={{margin:8}} />
                <Button shape="circle"
                        icon="plus"
                        onClick={() => {this.setState({ addRuleVisible: true })}} />
                <Modal title="定义事件"
                       visible={this.state.addRuleVisible}
                       footer={[<Button key="close" onClick={() => {this.setState({ addRuleVisible: false })}}>Close</Button>]}
                       onOk={null}
                       onCancel={() => {this.setState({ addRuleVisible: false })}} >
                    <ManageRulesDiv />
                </Modal>
                <br />
                <strong style={{ marginRight: 8 }}>显示的事件种类:</strong>
                {
                    Object.keys(this.getCurrProfile())
                        .map(ruleID=>(
                            /*
                               <CheckableTag
                               key={ruleIndAndHide.ind}
                               checked={!ruleIndAndHide.hide}
                               onChange={
                               checked => this.props.changeRuleVisibility(this.props.currProfileName, ruleIndAndHide.ind, checked)
                               }
                               >
                               <Badge status={this.resolveFetchingStatus(ruleIndAndHide.ind)}/>
                               {this.props.ruleObjs[ruleIndAndHide.ind].title}
                               </CheckableTag>
                             */
                            <RuleTag key={ruleID}
                                     checked={!this.getCurrProfile()[ruleID].hide}
                                     onChange={checked => this.props.changeRuleVisibility(this.props.currProfileName, ruleID, checked)}
                                     status={this.resolveFetchingStatus(ruleID)}
                                     title={ruleID}
                            />
                        ))
                }
                {this.state.everLoaded && <SimileTimeline events={this.getUnhiddenEvents()}/>}
            </div>
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

function tabSr(state, ownProps) {return state.app.tabs[ownProps.id]}
function logBaseSr(state, ownProps):?string { return tabSr(state, ownProps).logBase }
function eventsSr(state, ownProps) {
    const logBase=logBaseSr(state, ownProps)
    return logBase?state.app.events[logBase]:{}//rule
}//{rule:[eventObj...]...}

export const mapStateToProps = (state, ownProps)=>({
    logBase: logBaseSr(state, ownProps),
    events: eventsSr(state, ownProps),//ruleIDToEventsMap
    loading: tabSr(state, ownProps).loading,
    error: tabSr(state, ownProps).error,
    isFirstTime: !logBaseSr(state, ownProps),
    tabID: ownProps.id,
    profiles: state.app.profiles,//profNameToRule{ind,hide}Map
    currProfileName: tabSr(state, ownProps).currProfile,//profName:string
    ruleObjs: state.app.rules,//ruleMap
    loaded: tabSr(state, ownProps).loaded,
    autoFetch: tabSr(state, ownProps).autoFetch,
})

/*
const axnC8rMap = {
    dispatchLoad: (tab:string, logPathz:string|Array<string>)=>(dispatch, getState)=>{
        const action = { type:'LOAD', meta:{ logBase:logPathz, tab } }
        ipcRenderer.send('event-store', action)
        dispatch(action)
    },
    changeRuleVisibility: (profile:string, rule:number, checked:boolean)=>(dispatch, getState)=>{
        dispatch({ type:'CHANGE_RULE_VISIBILITY', payload:checked, meta:{profile, rule} })
    },
    setAutoFetch: (tab:string, autoFetch:boolean)=>(dispatch, getState)=>{
        dispatch({ type:'SET_AUTO_FETCH', payload:autoFetch, meta:{tab} })
    },
    fetch: (rule:Object)=>(dispatch, getState)=>{
        dispatch({ type:'FETCH', meta:{rule} })
    },
}
*/
/*
const axnC8rMap2 = {
    dispatchLoad: createAction('LOAD', ()=>undefined, (tab, logBase)=>({ tab, logBase })),
    changeRuleVisibility: createAction('CHANGE_RULE_VISIBILITY',
        (p1, p2, checked:boolean)=>checked,
        (profile:string, rule:number)=>({ profile, rule })),
    setAutoFetch: createAction('SET_AUTO_FETCH', (p1, autoFetch:boolean)=>autoFetch, (tab:string)=>({ tab })),
    fetch: createAction('FETCH', ()=>undefined, (rule:Object)=>({ rule }))
}
*/

export const actionCreatorMap = createActions({
    LOAD: [()=>undefined,
           (tab, logBase)=>({ tab, logBase })],
    CHANGE_RULE_VISIBILITY: [(p1, p2, checked:boolean)=>checked,
                             (profile:string, rule:number)=>({ profile, rule })],
    SET_AUTO_FETCH: [(p1, autoFetch:boolean)=>autoFetch,
                     (tab:string)=>({ tab })],
    FETCH: [()=>undefined,
            (rule:Object)=>({ rule })],
    CHANGE_PROFILE: [(tab:number, profile:string)=>(profile),
                     (tab:number)=>({ tab })],
    SET_RULES_OF_PROFILE: [(currProfileName, ruleIDs:Array<number>)=>(ruleIDs),
                           (currProfileName:string)=>({ profile: currProfileName })]
})

export default connect(mapStateToProps, actionCreatorMap)(Tab)
