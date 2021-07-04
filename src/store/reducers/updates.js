import * as actionTypes from '../actionTypes';

const initialState = {
    messages: []
}

const addMessage = (state, action) => {
    const newMessages = state.messages.map(msg => ({ ...msg }));
    newMessages.push(action.message);

    return {
        ...state,
        messages: newMessages
    };
}

const removeMessage = (state, action) => {
    const newMessages = state.messages.map(msg => ({ ...msg })).filter(msg => msg.id !== action.messageId);

    return {
        ...state,
        messages: newMessages
    }
}

const clearMessages = (state, action) => {
    const newMessages = state.messages.map(msg => ({ ...msg })).filter(msg => msg.convoId !== action.convoId);

    return {
        ...state,
        messages: newMessages
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_ADD_MESSAGE: return addMessage(state, action);
        case actionTypes.UPDATE_REMOVE_MESSAGE: return removeMessage(state, action);
        case actionTypes.UPDATE_CLEAR_MESSAGES: return clearMessages(state, action);
        default: return state;
    }
}

export default reducer;