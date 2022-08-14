export const initDatabase = () => {
    // db.config.debug = false;
    // db.collection('conversations').get();
}

export const deleteDatabase = () => {
    // db.delete();
}

//Groups
export const getGroups = () => {
    if (!window.indexedDB) {
        return [];
    }

    const request = window.indexedDB.open('CachedData', 1);
    request.onerror = event => {
        console.log('Couldn\'t get IndexedDB.');
    }
    request.onupgradeneeded = event => {
        const db = event.target.result;
        const objectStore = db.createObjectStore('groups', { keyPath: 'id' });
    }
    request.onsuccess = event => {
        const db = event.target.result;
        console.log('Got the local DB.');
        console.log(db);
    }

    return [];

    // return db.collection('groups').get().then(groups => {
    //     if (!groups) {
    //         return [];
    //     } else if (!Array.isArray(groups)) {
    //         return [groups];
    //     } else {
    //         return groups;
    //     }
    // })
}

export const getGroupWithId = groupId => {
    return Promise.resolve(null);
    // return db.collection('groups').doc({ id: groupId }).get();
}

export const addGroup = group => {
    return Promise.resolve(null);
    // return db.collection('groups').add(group);
}

export const updateGroup = group => {
    return Promise.resolve(null);
    // return db.collection('groups').doc({ id: group.id }).set(group);
}

export const deleteGroup = groupId => {
    return Promise.resolve(null);
    // return db.collection('groups').doc({ id: groupId }).delete();
}

export const deleteAllGroups = () => {
    return Promise.resolve(null);
    // return db.collection('groups').delete();
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
    return Promise.resolve([]);
    // return db.collection('posts').get().then(posts => {
    //     if (!posts) {
    //         return [];
    //     } else if (!Array.isArray(posts)) {
    //         return [posts];
    //     } else {
    //         return posts;
    //     }
    // });
}

export const getPost = postId => {
    return Promise.resolve(null);
    // return db.collection('posts').doc({ id: postId }).get();
}

export const addPost = post => {
    return Promise.resolve(null);
    // return db.collection('posts').add(post);
}

export const updatePost = post => {
    return Promise.resolve(null);
    // return db.collection('posts').doc({ id: post.id }).set(post);
}

export const deletePost = postId => {
    return Promise.resolve(null);
    // return db.collection('posts').doc({ id: postId }).delete();
}

export const deleteAllPosts = () => {
    return Promise.resolve(null);
    // return db.collection('posts').delete();
}

// Conversations
export const getConversations = () => {
    return Promise.resolve([]);
    // return db.collection('conversations').get();
}

export const getConversationWithId = convoId => {
    return Promise.resolve(null);
    // return db.collection('conversations').doc({ id: convoId }).get();
}

export const addConversation = conversation => {
    return Promise.resolve(null);
    // return db.collection('conversations').add(conversation);
}

export const updateConversation = conversation => {
    return Promise.resolve(null);
    // return db.collection('conversations').doc({ id: conversation.id }).set(conversation);
}

export const deleteConversationWithId = convoId => {
    return Promise.resolve(null);
    // return db.collection('conversations').doc({ id: convoId }).delete();
}

export const deleteAllConversations = () => {
    return Promise.resolve(null);
    // return db.collection('conversations').delete();
}

// Messages
export const getMessagesWithConvoId = convoId => {
    return Promise.resolve([]);
    // return db.collection('messages').get().then(messages => {
    //     if (messages) {
    //         return messages.filter(message => message.convoId === convoId);
    //     } else {
    //         return [];
    //     }
    // });
}

export const addMessage = message => {
    return Promise.resolve(null);
    // return db.collection('messages').add(message);
}

export const deleteMessagesWithConvoId = convoId => {
    return Promise.resolve(null);
    // return db.collection('messages').doc({ convoId: convoId }).get().then(msg => {
    //     if (msg) {
    //         return db.collection('messages').doc({ convoId: convoId }).delete();
    //     }
    // });
}

export const deleteMessagesWithPostId = postId => {
    return Promise.resolve(null);
    // return db.collection('messages').doc({ postId: postId }).get().then(msg => {
    //     if (msg) {
    //         return db.collection('messages').doc({ postId: postId }).delete();
    //     }
    // });
}

// Users
export const getUserWithId = userId => {
    return Promise.resolve(null);
    // return db.collection('users').doc({ id: userId }).get()
}

export const addUser = user => {
    return Promise.resolve(null);
    // return db.collection('users').add(user);
}

export const deleteUserWithId = userId => {
    return Promise.resolve(null);
    // return db.collection('users').doc({ id: userId }).delete();
}

export const updateUser = user => {
    return Promise.resolve(null);
    // return db.collection('users').doc({ id: user.id }).set(user);
}

export const ensureUserIsSaved = user => {
    return Promise.resolve(null);
    // return getUserWithId(user.id).then(responseUser => {
    //     if (responseUser) {
    //         return updateUser(user);
    //     } else {
    //         return addUser(user);
    //     }
    // });
}