import * as actionTypes from '../actionTypes';

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