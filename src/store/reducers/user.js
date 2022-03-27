import * as actionTypes from '../actionTypes';

const initialState = {
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    profilePicURL: null
}

const setUser = (state, action) => {
    return {
        ...state,
        firstName: action.firstName,
        lastName: action.lastName,
        username: action.username,
        email: action.email,
        profilePicURL: action.profilePicURL
    }
}

const clearUser = (state, action) => {
    return {
        firstName: null,
        lastName: null,
        username: null,
        email: null,
        profilePicURL: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_SET: return setUser(state, action);
        case actionTypes.USER_CLEAR: return clearUser(state, action);
        case actionTypes.ALL_CLEAR: return initialState;
        default: return state;
    }
}

export default reducer;