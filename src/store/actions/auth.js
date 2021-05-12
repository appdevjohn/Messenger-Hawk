import * as actionTypes from '../actionTypes';

export const startLogIn = (email, password) => {
    return dispatch => {
        dispatch({ type: actionTypes.AUTH_START });

        // mock log in
        setTimeout(() => {
            const token = 'token1';
            const userId = 'userId1';

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);

            return dispatch({
                type: actionTypes.AUTH_SUCCESS,
                token: token,
                userId: userId
            });
        }, 1000);
    }
}

export const startLogOut = () => {
    return dispatch => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        // Remove items from localStorage
        return dispatch({ type: actionTypes.AUTH_LOG_OUT });
    }
}

export const authCheckState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.AUTH_SET_LOADING,
            loading: true
        });

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
            return dispatch({
                type: actionTypes.AUTH_SUCCESS,
                token: token,
                userId: userId
            });
        } else {
            return dispatch({ type: actionTypes.AUTH_LOG_OUT });
        }
    }
}

export const setRedirectPath = redirectPath => {
    return {
        type: actionTypes.AUTH_SET_REDIRECT_PATH,
        redirectPath: redirectPath
    }
}

export const setLoading = isLoading => {
    return {
        type: actionTypes.AUTH_SET_LOADING,
        loading: isLoading
    }
}