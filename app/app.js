import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import store from './store';
import ipcPromise from 'ipc-promise'
import electron from 'electron'

ipcPromise.send('ping', 1).then((arg1)=>{console.log('ping received', arg1)})
electron.ipcRenderer.on('event-store-response', function (evt, arg) {
    console.log('received:', arg)
})

const initialState = {
    user: {
        currTab: 0,
        tabs: [{
            loading: false,
            events: null,
            eventFilters: [
                {title: 'output', beginnerMatch: 'startOutput', enderMatch: 'stopOutput'},
                {title: 'setMode', match: 'setMode'}
            ]
        }]
    },
    exam: {
        exam1: 1
    }
};
//console.log('state after creating store', store.getState())
const routerHistory = syncHistoryWithStore(hashHistory, store);
const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));
ReactDOM.render(
  <Provider store={store}>
    <Router history={routerHistory} routes={routes} />
  </Provider>,
  rootElement
);
