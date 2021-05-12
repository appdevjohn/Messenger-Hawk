import * as actionTypes from '../actionTypes';

const initialState = {
    token: null,
    userId: null,
    loading: false,
    error: null,
    redirectPath: '/'
}

const authStart = (state, action) => {
    return {
        ...state,
        token: null,
        userId: null,
        loading: true,
        error: null
    }
}

const authSuccess = (state, action) => {
    return {
        ...state,
        token: action.token,
        userId: action.userId,
        loading: false,
        error: null
    }
}

const authFail = (state, action) => {
    return {
        ...state,
        token: null,
        userId: null,
        loading: false,
        error: action.error
    }
}

const authLogOut = (state, action) => {
    return {
        ...state,
        token: null,
        userId: null,
        loading: false,
        error: null
    }
}

const authSetRedirectPath = (state, action) => {
    return {
        ...state,
        redirectPath: action.redirectPath
    }
}

const authSetLoading = (state, action) => {
    return {
        ...state,
        loading: action.loading
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOG_OUT: return authLogOut(state, action);
        case actionTypes.AUTH_SET_REDIRECT_PATH: return authSetRedirectPath(state, action);
        case actionTypes.AUTH_SET_LOADING: return authSetLoading(state, action);
        default: return state;
    }
}

export default reducer;