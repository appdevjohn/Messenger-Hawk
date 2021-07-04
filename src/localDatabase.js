import Localbase from 'localbase';

let db;

export const initDatabase = () => {
    db = new Localbase('db');
    db.config.debug = false;
}

// Conversations
export const getConversations = () => {
    return db.collection('conversations').get();
}

export const getConversationWithId = convoId => {
    return db.collection('conversations').doc({ id: convoId }).get();
}

export const addConversation = conversation => {
    return db.collection('conversations').add(conversation);
}

export const updateConversation = conversation => {
    return db.collection('conversations').doc({ id: conversation.id }).set(conversation);
}

export const deleteAllConversations = convoId => {
    return db.collection('conversations').delete();
}

// Messages
export const getMessagesWithConvoId = convoId => {
    return db.collection('messages').get().then(messages => {
        if (messages) {
            return messages.filter(message => message.convoId = convoId);
        } else {
            return [];
        }
    });
}

export const addMessage = message => {
    return db.collection('messages').add(message);
}

export const deleteMessagesWithConvoId = convoId => {
    return db.collection('messages').doc({ convoId: convoId }).delete();
}