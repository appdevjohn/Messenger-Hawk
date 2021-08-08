import Localbase from 'localbase';

let db = new Localbase('db');

// Localbase does not actually set up a database until something is done with it. This may cause a crash the first time its set up if the conditions are right. This is a workaround that forces a database to be set up.
export const initDatabase = () => {
    db.config.debug = false;
    db.collection('conversations').get();
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

export const deleteAllConversations = () => {
    return db.collection('conversations').delete();
}

// Messages
export const getMessagesWithConvoId = convoId => {
    return db.collection('messages').get().then(messages => {
        if (messages) {
            return messages.filter(message => message.convoId === convoId);
        } else {
            return [];
        }
    });
}

export const addMessage = message => {
    return db.collection('messages').add(message);
}

export const deleteMessagesWithConvoId = convoId => {
    return db.collection('messages').doc({ convoId: convoId }).get().then(msg => {
        if (msg) {
            return db.collection('messages').doc({ convoId: convoId }).delete();
        }
    });
}

// Users
export const getUserWithId = userId => {
    return db.collection('users').doc({ id: userId }).get()
}

export const addUser = user => {
    return db.collection('users').add(user);
}

export const deleteUserWithId = userId => {
    return db.collection('users').doc({ id: userId }).delete();
}

export const updateUser = user => {
    return db.collection('users').doc({ id: user.id }).set(user);
}

export const ensureUserIsSaved = user => {
    return getUserWithId(user.id).then(responseUser => {
        if (responseUser) {
            return updateUser(user);
        } else {
            return addUser(user);
        }
    });
}