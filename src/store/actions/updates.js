import * as actionTypes from '../actionTypes';

export const updateAddMessage = message => {
    return {
        type: actionTypes.UPDATE_ADD_MESSAGE,
        message: message
    }
}

export const updateRemoveMessage = messageId => {
    return {
        type: actionTypes.UPDATE_REMOVE_MESSAGE,
        messageId: messageId
    }
}

export const updateClearMessages = () => {
    return {
        type: actionTypes.UPDATE_CLEAR_MESSAGES
    }
}