import * as actionTypes from '../actionTypes';

export const setUser = (firstName, lastName, username, email, profilePicURL) => {
    return {
        type: actionTypes.USER_SET,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        profilePicURL: profilePicURL
    }
}

export const clearUser = () => {
    return {
        type: actionTypes.USER_CLEAR
    }
}