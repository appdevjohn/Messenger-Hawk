import * as actionTypes from '../actionTypes';

const initialState = null;

const errorSet = (state, action) => {
    return {
        title: action.title,
        body: action.body
    }
}

const errorClear = (state, action) => {
    return null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ERROR_SET: return errorSet(state, action);
        case actionTypes.ERROR_CLEAR: return errorClear(state, action);
        default: return state;
    }
}

export default reducer;