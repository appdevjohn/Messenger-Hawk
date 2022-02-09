import * as actionTypes from '../actionTypes';
import api from '../../api';
import * as localDB from '../../localDatabase';

export const setActiveGroupId = groupId => {
    return {
        type: actionTypes.GROUP_SET_ACTIVE_ID,
        groupId: groupId
    }
}

export const setGroups = groups => {
    return {
        type: actionTypes.GROUP_SET_ALL,
        groups: groups
    }
}

export const requestJoinGroup = (groupId, userId, token) => {
    return dispatch => {
        if (groupId && userId) {
            dispatch({ type: actionTypes.GROUP_CHANGING, changing: true });

            api.post(`/groups/${groupId}/add-user`, {
                userId: userId,
                approved: true
            }, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                const joinedGroup = response.data.group;
                localDB.addGroup(joinedGroup);
                dispatch({ type: actionTypes.GROUP_ADD, group: joinedGroup });
                dispatch({ type: actionTypes.GROUP_CHANGING, changing: false });
            }).catch(error => {
                console.error(error);
                dispatch({ type: actionTypes.GROUP_CHANGING, changing: false });
            });
        }
    }
}

export const requestLeaveGroup = (groupId, userId, token) => {
    return dispatch => {
        if (groupId && userId) {
            dispatch({ type: actionTypes.GROUP_CHANGING, changing: false });

            api.post(`/groups/${groupId}/remove-user`, {
                userId: userId
            }, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                const leftGroupId = response.data.group.id;
                localDB.deleteGroup(leftGroupId);
                dispatch({ type: actionTypes.GROUP_REMOVE, groupId: leftGroupId })
                dispatch({ type: actionTypes.GROUP_CHANGING, changing: false });
            }).catch(error => {
                console.error(error);
                dispatch({ type: actionTypes.GROUP_CHANGING, changing: false });
            });
        }
    }
}

export const checkActiveGroup = token => {
    const getGroups = async () => {
        if (token) {
            const response = await api.get('/groups', {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Conotent-Type': 'application/json'
                }
            });

            return response.data.groups;
        } else {
            return null;
        }
    }

    const setupGroupState = async (dispatch) => {
        dispatch({
            type: actionTypes.GROUP_LOADING,
            loading: true
        });

        const localGroups = await localDB.getGroups();
        dispatch(setGroups(localGroups));

        const groupId = await localDB.getLastViewedGroupId();
        let newActiveGroupId = null;
        if (groupId) {
            newActiveGroupId = groupId;
        } else if (localGroups.length > 0) {
            newActiveGroupId = localGroups[0].id;
            localDB.setLastViewedGroupId(newActiveGroupId);
        }
        dispatch(setActiveGroupId(newActiveGroupId));

        const serverGroups = await getGroups();
        if (serverGroups) {
            localDB.deleteAllGroups();
            serverGroups.forEach(g => {
                localDB.addGroup(g);
            });
            dispatch(setGroups(serverGroups));

            if (serverGroups.length > 0 && serverGroups.findIndex(g => g.id === newActiveGroupId) < 0) {
                localDB.setLastViewedGroupId(serverGroups[0].id);
                dispatch(setActiveGroupId(serverGroups[0].id));
            } else if (serverGroups.length === 0) {
                localDB.deleteLastViewedGroupId();
                dispatch(setActiveGroupId(null));
            }
        }

        dispatch({
            type: actionTypes.GROUP_LOADING,
            loading: false
        });
    }

    return dispatch => {
        setupGroupState(dispatch);
    }
}