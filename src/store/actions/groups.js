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
                dispatch(setActiveGroupId(serverGroups[0]));
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