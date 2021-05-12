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
        return dispatch({ type: actionTypes.AUTH_FAIL });
    }
}

export const setLoading = isLoading => {
    return {
        type: actionTypes.AUTH_SET_LOADING,
        loading: isLoading
    }
}