import * as actionTypes from '../actionTypes';

export const setError = (title, body) => {
    return {
        type: actionTypes.ERROR_SET,
        title: title,
        body: body
    }
}

export const clearError = () => {
    return {
        type: actionTypes.ERROR_CLEAR
    }
}