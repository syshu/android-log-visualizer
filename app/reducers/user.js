import { handleActions } from 'redux-actions';
import actions from '../actions/user';

export default handleActions({
    [actions.login]: (state, action) => {
        return { ...state, ...action.payload }
    },
    [actions.loadLogPending]: (state, action) => {
        return { ...state, tabs:[]}
    }
}, {
    currTab: 0,
    tabs: [{
        loading: false,
        events: null,
        eventFilters: [
            {title: 'output', beginnerMatch: 'startOutput', enderMatch: 'stopOutput'},
            {title: 'setMode', match: 'setMode'}
        ]
    }]
});
