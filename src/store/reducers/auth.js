import * as actionTypes from '../actionTypes';

const initialState = {
    userId: undefined,
    token: undefined,
    activated: undefined,
    loading: false,
    message: null,
    redirectPath: '/'
}

const authStart = (state, action) => {
    return {
        ...state,
        userId: null,
        token: null,
        activated: false,
        loading: true,
        message: null
    }
}

const authSuccess = (state, action) => {
    return {
        ...state,
        userId: action.userId,
        token: action.token,
        activated: action.activated,
        loading: false,
        message: null
    }
}

const authFail = (state, action) => {
    return {
        ...state,
        userId: null,
        token: null,
        activated: false,
        loading: false,
        message: action.message
    }
}

const authLogOut = (state, action) => {
    return {
        ...state,
        userId: null,
        token: null,
        activated: false,
        loading: false,
        message: null
    }
}

const authActivate = (state, action) => {
    return {
        ...state,
        activated: false,
        loading: true
    }
}

const authActivateSuccess = (state, action) => {
    return {
        ...state,
        activated: true,
        token: action.token,
        loading: false,
        message: null
    }
}

const authActivateFail = (state, action) => {
    return {
        ...state,
        activated: false,
        loading: false,
        message: action.message
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

const authSetMessage = (state, action) => {
    return {
        ...state,
        message: action.message
    }
}

const authClearMessage = (state, action) => {
    return {
        ...state,
        message: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOG_OUT: return authLogOut(state, action);
        case actionTypes.AUTH_ACTIVATE: return authActivate(state, action);
        case actionTypes.AUTH_ACTIVATE_SUCCESS: return authActivateSuccess(state, action);
        case actionTypes.AUTH_ACTIVATE_FAIL: return authActivateFail(state, action);
        case actionTypes.AUTH_SET_REDIRECT_PATH: return authSetRedirectPath(state, action);
        case actionTypes.AUTH_SET_LOADING: return authSetLoading(state, action);
        case actionTypes.AUTH_SET_MESSAGE: return authSetMessage(state, action);
        case actionTypes.AUTH_CLEAR_MESSAGE: return authClearMessage(state, action);
        default: return state;
    }
}

export default reducer;