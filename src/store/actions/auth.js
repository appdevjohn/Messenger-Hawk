import api from '../../api';
import * as actionTypes from '../actionTypes';

export const startSignUp = (firstName, lastName, email, password, confirmPassword) => {
    return dispatch => {
        dispatch({ type: actionTypes.AUTH_START });

        if (password !== confirmPassword) {
            return dispatch({
                type: actionTypes.AUTH_FAIL,
                error: 'Your passwords do not match.'
            });
        }

        return api.post('/auth/signup', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }).then(response => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('activated', response.data.activated);
            return dispatch({
                type: actionTypes.AUTH_SUCCESS,
                token: response.data.token,
                activated: response.data.activated
            });
        }).catch(error => {
            if (error.response) {
                return dispatch({
                    type: actionTypes.AUTH_FAIL,
                    error: error.response.data.message
                });
            } else {
                return dispatch({
                    type: actionTypes.AUTH_FAIL,
                    error: 'An error occurred trying to log in.'
                });
            }
        });
    }
}

export const startLogIn = (email, password) => {
    return dispatch => {
        dispatch({ type: actionTypes.AUTH_START });

        return api.post('/auth/login', {
            email: email,
            password: password
        }).then(response => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('activated', response.data.activated);
            return dispatch({
                type: actionTypes.AUTH_SUCCESS,
                token: response.data.token,
                activated: response.data.activated
            });
        }).catch(error => {
            if (error.response) {
                return dispatch({
                    type: actionTypes.AUTH_FAIL,
                    error: error.response.data.message
                });
            } else {
                return dispatch({
                    type: actionTypes.AUTH_FAIL,
                    error: 'An error occurred trying to log in.'
                });
            }
        });
    }
}

export const startConfirmEmail = (token, code) => {
    return dispatch => {
        dispatch({ type: actionTypes.AUTH_ACTIVATE });

        return api.post('/auth/confirm-email', {
            activateToken: code
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(response => {
            localStorage.setItem('activated', response.data.activated);
            dispatch({
                type: actionTypes.AUTH_SET_ACTIVATED,
                activated: response.data.activated,
                error: null
            });
        }).catch(error => {
            console.log(error.response);
            let errorMessage = 'There was an error activating your account.';
            if (error.response) {
                errorMessage = error.response.data.message;
            } else {
                dispatch({
                    type: actionTypes.AUTH_LOG_OUT
                });
            }
            dispatch({
                type: actionTypes.AUTH_SET_ACTIVATED,
                activated: false,
                error: errorMessage
            });
        });
    }
}

export const startLogOut = () => {
    return dispatch => {
        localStorage.removeItem('token');
        localStorage.removeItem('activated');

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
        const activated = localStorage.getItem('activated') === 'true';

        api.get('/auth/ping', {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.data.message !== 'Authenticated') {
                dispatch(startLogOut());
            }
        }).catch(error => {
            dispatch(startLogOut());
        })

        if (token) {
            return dispatch({
                type: actionTypes.AUTH_SUCCESS,
                token: token,
                activated: activated
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

export const clearError = () => {
    return {
        type: actionTypes.AUTH_CLEAR_ERROR
    }
}