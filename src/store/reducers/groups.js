import * as actionTypes from '../actionTypes';

const initialState = {
    activeGroupId: null,
    activeGroup: null,
    groups: [],
    changing: false,
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

const addGroup = (state, action) => {
    return {
        ...state,
        groups: [...state.groups.map(g => ({ ...g })), action.group]
    }
}

const removeGroup = (state, action) => {
    return {
        ...state,
        groups: state.groups.filter(g => g.id !== action.groupId).map(g => ({ ...g }))
    }
}

const setGroupsChanging = (state, action) => {
    return {
        ...state,
        changing: action.changing
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
        case actionTypes.GROUP_ADD: return addGroup(state, action);
        case actionTypes.GROUP_REMOVE: return removeGroup(state, action);
        case actionTypes.GROUP_CHANGING: return setGroupsChanging(state, action);
        case actionTypes.GROUP_LOADING: return setLoading(state, action);
        default: return state;
    }
}

export default reducer;