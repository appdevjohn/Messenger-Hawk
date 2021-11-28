import * as actionTypes from '../actionTypes';

const initialState = null;

const setActiveGroup = (state, action) => {
    return action.groupId;
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ACTIVE_GROUP_SET: return setActiveGroup(state, action);
        default: return state;
    }
}

export default reducer;