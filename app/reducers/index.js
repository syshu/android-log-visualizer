import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import user from './user'
import app from './appr'

export default combineReducers({
    routing:routerReducer,
    app,
    user,
} )