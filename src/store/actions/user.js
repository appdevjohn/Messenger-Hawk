import * as actionTypes from '../actionTypes';
import * as localDB from '../../localDatabase';

export const setUser = (firstName, lastName, username, email) => {
    return {
        type: actionTypes.USER_SET,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email
    }
}

export const clearUser = () => {
    return {
        type: actionTypes.USER_CLEAR
    }
}

export const setUpUser = userId => {
    return dispatch => {
        localDB.getUserWithId(userId).then(user => {
            return dispatch(setUser(user.firstName, user.lastName, user.username, user.email));
        }).catch(() => {
            return dispatch({ type: 'non_action' });
        });
    }
}