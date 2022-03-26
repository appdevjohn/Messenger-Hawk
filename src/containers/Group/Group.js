import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import api from '../../api';
import * as groupActions from '../../store/actions/groups';
import { setError } from '../../store/actions/error';
import NavBar from '../../navigation/NavBar/NavBar';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './Group.module.css';
import backImg from '../../assets/back.png';
import optionsImg from '../../assets/options.png';

const Group = props => {
    const dispatch = useDispatch();

    const groupId = props.match.params.id;
    const token = useSelector(state => state.auth.token);
    const userId = useSelector(state => state.auth.userId);
    const joinedGroups = useSelector(state => state.groups.groups);
    const isChangingGroups = useSelector(state => state.groups.changing);

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [requests, setRequests] = useState([]);
    const isMember = group && joinedGroups ? (joinedGroups.find(g => g.id === group.id) ? true : false) : null;

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (token && groupId) {
            setIsLoading(true);

            api.get(`/groups/${groupId}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                setGroup(response.data.group);
                setMembers(response.data.members.map(m => ({ ...m, isLoading: false })));
                setRequests(response.data.requests.map(r => ({ ...r, isLoading: false })));
                setIsLoading(false);
            }).catch(error => {
                console.error(error.response?.data?.message);
                setIsLoading(false);
            });
        }
    }, [token, groupId])

    const requestJoinHandler = () => {
        dispatch(groupActions.requestJoinGroup(groupId, userId, token));
    }

    const leaveGroupHandler = () => {
        dispatch(groupActions.requestLeaveGroup(groupId, userId, token));
    }

    const makeAdminHandler = (newAdminId, status) => {
        setMembers(oldMembers => {
            const newMembers = oldMembers.map(m => ({ ...m }));
            const updatedMember = newMembers.find(m => m.id === newAdminId);
            updatedMember.isLoading = true;
            return newMembers;
        });

        api.put(`/groups/${groupId}/set-admin`, {
            userId: newAdminId,
            admin: status
        }, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setMembers(oldMembers => {
                const newMembers = oldMembers.map(m => ({ ...m }));
                const updatedMember = newMembers.find(m => m.id === response.data.userId);
                updatedMember.admin = response.data.admin;
                updatedMember.isLoading = false;
                return newMembers;
            });
        }).catch(error => {
            dispatch(setError('Could Not Change Admin Status', error.response?.data?.message));
            setMembers(oldMembers => {
                const newMembers = oldMembers.map(m => ({ ...m }));
                const updatedMember = newMembers.find(m => m.id === newAdminId);
                updatedMember.isLoading = false;
                return newMembers;
            });
        });
    }

    const removeUserHandler = removedUserId => {
        const isMember = members.find(m => m.id === removedUserId) !== undefined;
        if (!isMember && requests.find(r => r.id === removedUserId) === undefined) {
            dispatch(setError('Could Not Deny Request', 'This user is not a member nor is trying to be.'));
            return;
        }

        if (isMember) {
            setMembers(oldMembers => {
                const newMembers = oldMembers.map(m => ({ ...m }));
                const updatedMember = newMembers.find(m => m.id === removedUserId);
                updatedMember.isLoading = true;
                return newMembers;
            });
        } else {
            setRequests(oldRequests => {
                const newRequests = oldRequests.map(r => ({ ...r }));
                const updatedRequest = newRequests.find(r => r.id === removedUserId);
                updatedRequest.isLoading = true;
                return newRequests;
            });
        }

        api.post(`/groups/${groupId}/remove-user`, {
            userId: removedUserId,
        }, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (isMember) {
                setMembers(oldMembers => oldMembers.filter(m => m.id !== response.data.userId));
            } else {
                setRequests(oldRequests => oldRequests.filter(m => m.id !== response.data.userId));
            }

        }).catch(error => {
            if (isMember) {
                dispatch(setError('Could Not Remove User', error.response?.data?.message || 'There was an error on the server.'));
                setMembers(oldMembers => {
                    const newMembers = oldMembers.map(m => ({ ...m }));
                    const updatedMember = newMembers.find(m => m.id === removedUserId);
                    updatedMember.isLoading = false;
                    return newMembers;
                });
            } else {
                dispatch(setError('Could Not Deny Request', error.response?.data?.message || 'There was an error on the server.'));
                setRequests(oldRequests => {
                    const newRequests = oldRequests.map(r => ({ ...r }));
                    const updatedRequest = newRequests.find(r => r.id === removedUserId);
                    updatedRequest.isLoading = false;
                    return updatedRequest;
                });
            }
        });
    }

    const approveUserHandler = approvedUserId => {
        setRequests(oldRequests => {
            const newRequests = oldRequests.map(r => ({ ...r }));
            const updatedRequest = newRequests.find(m => m.id === approvedUserId);
            updatedRequest.isLoading = true;
            return newRequests;
        });

        api.put(`/groups/${groupId}/requests/${approvedUserId}/approve`, {}, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            const newMember = requests.find(m => m.id === response.data.userId);
            if (newMember) {
                setMembers(members => [...members.map(m => ({ ...m })), { ...newMember, isLoading: false }]);
            }
            setRequests(member => member.filter(m => m.id !== response.data.userId));
        }).catch(error => {
            dispatch(setError('Could Not Approve User', error.response?.data?.message));
            setRequests(oldRequests => {
                const newRequests = oldRequests.map(r => ({ ...r }));
                const updatedRequest = newRequests.find(m => m.id === approvedUserId);
                updatedRequest.isLoading = false;
                return newRequests;
            });
        });
    }

    if (isLoading) {
        return (
            <div className={classes.Group}>
                <NavBar title="Group" leftButton={{ img: backImg, alt: 'Back', onClick: props.history.goBack }} />
                {isLoading ? <LoadingIndicator /> : null}
            </div>
        )
    }

    return (
        <div className={classes.Group}>
            <NavBar
                title="Group"
                leftButton={{ img: backImg, alt: 'Back', onClick: props.history.goBack }}
                rightButton={{ img: optionsImg, alt: 'Edit', to: `/groups/${groupId}/edit` }} />
            {group ? (
                <div className={classes.groupDetails}>
                    <h1 className={classes.groupTitle}>{group.name}</h1>
                    <p className={classes.groupDescription}>{group.description}</p>
                </div>
            ) : null}
            {members.filter(m => m.id !== userId).length > 0 ? (
                <div className={classes.memberContainer}>
                    <div className={classes.membersTitle}>Members</div>
                    <div className={classes.members}>
                        {members.filter(m => m.id !== userId).map(m => (
                            <div className={classes.member} key={m.id}>
                                <div>{m.firstName} {m.lastName}</div>
                                {!m.admin
                                    ? <button className="UnemphasizedBtn" onClick={() => makeAdminHandler(m.id, true)}>Make Admin</button>
                                    : <button className="UnemphasizedBtn" onClick={() => makeAdminHandler(m.id, false)}>Revoke Admin</button>}
                                <button className="UnemphasizedBtn" onClick={() => removeUserHandler(m.id)}>Remove</button>
                                {m.isLoading ? <LoadingIndicator /> : null}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
            {requests.length > 0 ? (
                <div className={classes.requestContainer}>
                    <div className={classes.requestsTitle}>Join Requests</div>
                    <div className={classes.requests}>
                        {requests.map(r => (
                            <div className={classes.member} key={r.id}>
                                <div>{r.firstName} {r.lastName}</div>
                                <button className="UnemphasizedBtn" onClick={() => approveUserHandler(r.id)}>Approve</button>
                                <button className="UnemphasizedBtn" onClick={() => removeUserHandler(r.id)}>Deny</button>
                                {r.isLoading ? <LoadingIndicator /> : null}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
            <div className="SubmitBtnContainer">
                {isMember
                    ? <button className="SubmitBtn" onClick={leaveGroupHandler}>Leave Group</button>
                    : <button className="SubmitBtn" onClick={requestJoinHandler}>Join Group</button>}
            </div>
            {isChangingGroups ? <LoadingIndicator /> : null}
        </div>
    )
}

export default withRouter(Group);