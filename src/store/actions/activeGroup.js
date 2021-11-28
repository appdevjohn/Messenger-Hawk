import * as actionTypes from '../actionTypes';

export const setActiveGroup = groupId => {
    return {
        type: actionTypes.ACTIVE_GROUP_SET,
        groupId: groupId
    }
}