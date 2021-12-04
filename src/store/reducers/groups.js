import * as actionTypes from '../actionTypes';

const initialState = {
    activeGroupId: null,
    activeGroup: null,
    groups: [],
    loading: false
};

const setActiveGroupId = (state, action) => {
    return {
        ...state,
        activeGroupId: action.groupId,
        activeGroup: state.groups.find(g => g.id === action.groupId) || null
    }
}

const setAllGroups = (state, action) => {
    return {
        ...state,
        groups: action.groups
    }
}

const setLoading = (state, action) => {
    return {
        ...state,
        loading: action.loading
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GROUP_SET_ACTIVE_ID: return setActiveGroupId(state, action);
        case actionTypes.GROUP_SET_ALL: return setAllGroups(state, action);
        case actionTypes.GROUP_LOADING: return setLoading(state, action);
        default: return state;
    }
}

export default reducer;