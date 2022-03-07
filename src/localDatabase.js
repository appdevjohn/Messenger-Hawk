import Localbase from 'localbase';

let db = new Localbase('db');

// Localbase does not actually set up a database until something is done with it. This may cause a crash the first time its set up if the conditions are right. This is a workaround that forces a database to be set up.
export const initDatabase = () => {
    db.config.debug = false;
    db.collection('conversations').get();
}

export const deleteDatabase = () => {
    db.delete();
}

//Groups
export const getGroups = () => {
    return db.collection('groups').get().then(groups => {
        if (!groups) {
            return [];
        } else if (!Array.isArray(groups)) {
            return [groups];
        } else {
            return groups;
        }
    })
}

export const getGroupWithId = groupId => {
    return db.collection('groups').doc({ id: groupId }).get();
}

export const addGroup = group => {
    return db.collection('groups').add(group);
}

export const updateGroup = group => {
    return db.collection('groups').doc({ id: group.id }).set(group);
}

export const deleteGroup = groupId => {
    return db.collection('groups').doc({ id: groupId }).delete();
}

export const deleteAllGroups = () => {
    return db.collection('groups').delete();
}

export const setLastViewedGroupId = groupId => {
    return localStorage.setItem('defaultGroupId', groupId);
}

export const getLastViewedGroupId = () => {
    return localStorage.getItem('defaultGroupId');
}

export const deleteLastViewedGroupId = () => {
    return localStorage.removeItem('defaultGroupId');
}

//Posts
export const getPostsFromGroup = groupId => {
    return db.collection('posts').get().then(posts => {
        if (!posts) {
            return [];
        } else if (!Array.isArray(posts)) {
            return [posts];
        } else {
            return posts;
        }
    });
}

export const getPost = postId => {
    return db.collection('posts').doc({ id: postId }).get();
}

export const addPost = post => {
    return db.collection('posts').add(post);
}

export const updatePost = post => {
    return db.collection('posts').doc({ id: post.id }).set(post);
}

export const deletePost = postId => {
    return db.collection('posts').doc({ id: postId }).delete();
}

export const deleteAllPosts = () => {
    return db.collection('posts').delete();
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

export const deleteConversationWithId = convoId => {
    return db.collection('conversations').doc({ id: convoId }).delete();
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

export const deleteMessagesWithPostId = postId => {
    return db.collection('messages').doc({ postId: postId }).get().then(msg => {
        if (msg) {
            return db.collection('messages').doc({ postId: postId }).delete();
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