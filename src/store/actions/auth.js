import api from '../../api';
import * as localDB from '../../localDatabase';
import * as actionTypes from '../actionTypes';

export const startSignUp = (firstName, lastName, email, username, password, confirmPassword) => {
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
            username: username,
            password: password
        }).then(response => {
            localStorage.setItem('userId', response.data.user.id);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('activated', response.data.activated);

            localDB.getUserWithId(response.data.user.id).then(user => {
                if (user) {
                    localDB.updateUser(response.data.user);
                } else {
                    localDB.addUser(response.data.user);
                }
            });

            dispatch({
                type: actionTypes.USER_SET,
                firstName: response.data.user.firstName,
                lastName: response.data.user.lastName,
                username: response.data.user.username,
                email: response.data.user.email,
            });

            return dispatch({
                type: actionTypes.AUTH_SUCCESS,
                userId: response.data.user.id,
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

        return api.put('/auth/login', {
            email: email,
            password: password
        }).then(response => {
            localStorage.setItem('userId', response.data.user.id);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('activated', response.data.activated);

            localDB.getUserWithId(response.data.user.id).then(user => {
                if (user) {
                    localDB.updateUser(response.data.user);
                } else {
                    localDB.addUser(response.data.user);
                }
            });

            dispatch({
                type: actionTypes.USER_SET,
                firstName: response.data.user.firstName,
                lastName: response.data.user.lastName,
                username: response.data.user.username,
                email: response.data.user.email,
            });
            
            return dispatch({
                type: actionTypes.AUTH_SUCCESS,
                userId: response.data.user.id,
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

        return api.put('/auth/confirm-email', {
            activateToken: code
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(response => {
            localStorage.setItem('activated', response.data.activated);
            localStorage.setItem('token', response.data.token);
            dispatch({
                type: actionTypes.AUTH_SET_ACTIVATED,
                activated: response.data.activated,
                token: response.data.token,
                error: null
            });
        }).catch(error => {
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
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('activated');

        dispatch({ type: actionTypes.USER_CLEAR });
        return dispatch({ type: actionTypes.AUTH_LOG_OUT });
    }
}

export const authCheckState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.AUTH_SET_LOADING,
            loading: true
        });

        const userId = localStorage.getItem('userId');
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
                userId: userId,
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