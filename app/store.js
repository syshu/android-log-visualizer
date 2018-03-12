import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { hashHistory } from 'react-router';
import { routerMiddleware, routerReducer as routing, push } from 'react-router-redux';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';
import createIpcMiddleware from 'redux-electron-ipc'

import userActions from './actions/user';
import reducer from './reducers'

const router = routerMiddleware(hashHistory);
const ipcMiddleware = createIpcMiddleware({
    'event-store-response': ((evt, arg)=>arg),
    'event-store': ((evt, arg)=>arg)
})

const actionCreators = {
  ...userActions,
  push
}

const middlewares = [ thunk, ipcMiddleware, router ];

const composeEnhancers = (() => {
  const compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if(process.env.NODE_ENV === 'development' && compose_) {
    return compose_({ actionCreators });
  }
  return compose;
})();

export default function configureStore(initialState) {
    //const enhancer = composeEnhancers(applyMiddleware(...middlewares), persistState())
    const enhancer = applyMiddleware(...middlewares)
    return createStore(reducer, initialState, enhancer);
}
