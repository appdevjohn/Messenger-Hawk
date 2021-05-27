import * as actionTypes from '../actionTypes';

const initialState = {
    token: undefined,
    activated: undefined,
    loading: false,
    error: null,
    redirectPath: '/'
}

const authStart = (state, action) => {
    return {
        ...state,
        token: null,
        activated: false,
        loading: true,
        error: null
    }
}

const authSuccess = (state, action) => {
    return {
        ...state,
        token: action.token,
        activated: action.activated,
        loading: false,
        error: null
    }
}

const authFail = (state, action) => {
    return {
        ...state,
        token: null,
        activated: false,
        loading: false,
        error: action.error
    }
}

const authLogOut = (state, action) => {
    return {
        ...state,
        token: null,
        activated: false,
        loading: false,
        error: null
    }
}

const authActivate = (state, action) => {
    return {
        ...state,
        activated: false,
        loading: true
    }
}

const authSetActivated = (state, action) => {
    return {
        ...state,
        activated: action.activated,
        loading: false,
        error: action.error
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

const authClearError = (state, action) => {
    return {
        ...state,
        error: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOG_OUT: return authLogOut(state, action);
        case actionTypes.AUTH_ACTIVATE: return authActivate(state, action);
        case actionTypes.AUTH_SET_ACTIVATED: return authSetActivated(state, action);
        case actionTypes.AUTH_SET_REDIRECT_PATH: return authSetRedirectPath(state, action);
        case actionTypes.AUTH_SET_LOADING: return authSetLoading(state, action);
        case actionTypes.AUTH_CLEAR_ERROR: return authClearError(state, action);
        default: return state;
    }
}

export default reducer;