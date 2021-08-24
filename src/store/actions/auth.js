import api from '../../api';
import * as localDB from '../../localDatabase';
import * as actionTypes from '../actionTypes';
import * as userActions from '../actions/user';
import { deleteDatabase } from '../../localDatabase';

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
            const userData = response.data.user;

            localStorage.setItem('userId', userData.id);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('activated', response.data.activated);

            localDB.ensureUserIsSaved(userData);

            dispatch(userActions.setUser(userData.firstName, userData.lastName, userData.username, userData.email, userData.profilePicURL));

            return dispatch({
                type: actionTypes.AUTH_SUCCESS,
                userId: userData.id,
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
            const userData = response.data.user;

            localStorage.setItem('userId', userData.id);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('activated', response.data.activated);

            localDB.ensureUserIsSaved(userData);

            dispatch(userActions.setUser(userData.firstName, userData.lastName, userData.username, userData.email, userData.profilePicURL));
            
            return dispatch({
                type: actionTypes.AUTH_SUCCESS,
                userId: userData.id,
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
                type: actionTypes.AUTH_ACTIVATE_SUCCESS,
                token: response.data.token
            });

        }).catch(error => {
            dispatch({
                type: actionTypes.AUTH_ACTIVATE_FAIL,
                error: error.response?.data?.message || 'There was an error activating your account.'
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

export const startDeleteAccount = token => {
    return dispatch => {
        dispatch(setLoading(true));

        return api.delete('/auth/delete-account', {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(() => {
            deleteDatabase();
            return dispatch(startLogOut());

        }).catch(error => {
            dispatch(setLoading(false));
            return dispatch(setError(error.response?.data?.message || 'Could not delete account.'));
        })
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
                dispatch(userActions.clearUser());
            } else {
                localDB.ensureUserIsSaved(response.data.user);
                
                dispatch(userActions.setUser(response.data.user.firstName, response.data.user.lastName, response.data.user.username, response.data.user.email, response.data.user.profilePicURL));
            }
        }).catch(() => {
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

export const setError = () => {
    return {
        type: actionTypes.AUTH_SET_ERROR
    }
}

export const clearError = () => {
    return {
        type: actionTypes.AUTH_CLEAR_ERROR
    }
}