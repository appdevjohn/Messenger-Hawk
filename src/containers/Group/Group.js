import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import api from '../../api';
import * as groupActions from '../../store/actions/groups';
import NavBar from '../../navigation/NavBar/NavBar';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './Group.module.css';
import backImg from '../../assets/back.png';

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
                console.error(error.response.data.message);
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
            console.error(error.response.data.message);
            setMembers(oldMembers => {
                const newMembers = oldMembers.map(m => ({ ...m }));
                const updatedMember = newMembers.find(m => m.id === newAdminId);
                updatedMember.isLoading = false;
                return newMembers;
            });
        });
    }

    const removeUserHandler = removedUserId => {
        setMembers(oldMembers => {
            const newMembers = oldMembers.map(m => ({ ...m }));
            const updatedMember = newMembers.find(m => m.id === removedUserId);
            updatedMember.isLoading = true;
            return newMembers;
        });

        api.post(`/groups/${groupId}/remove-user`, {
            userId: removedUserId,
        }, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setMembers(member => member.filter(m => m.id !== response.data.userId));
        }).catch(error => {
            console.error(error.response.data.message);
            setMembers(oldMembers => {
                const newMembers = oldMembers.map(m => ({ ...m }));
                const updatedMember = newMembers.find(m => m.id === removedUserId);
                updatedMember.isLoading = false;
                return newMembers;
            });
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
            console.error(error.response.data.message);
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
            <NavBar title="Group" leftButton={{ img: backImg, alt: 'Back', onClick: props.history.goBack }} />
            {group ? (
                <Fragment>
                    <h1>{group.name}</h1>
                    <p>{group.description}</p>
                </Fragment>
            ) : null}
            <div className={classes.memberContainer}>
                <div className={classes.membersTitle}>Members</div>
                <div className={classes.members}>
                    {members.map(m => (
                        <div className={classes.member} key={m.id}>
                            <div>{m.firstName} {m.lastName}</div>
                            {!m.admin
                                ? <Fragment>
                                    <button className="UnemphasizedBtn" onClick={() => makeAdminHandler(m.id, true)}>Make Admin</button>
                                    <button className="UnemphasizedBtn" onClick={() => removeUserHandler(m.id)}>Remove</button>
                                </Fragment>
                                : <Fragment>
                                    <button className="UnemphasizedBtn" onClick={() => makeAdminHandler(m.id, false)}>Revoke Admin</button>
                                    <button className="UnemphasizedBtn" onClick={() => removeUserHandler(m.id)}>Remove</button>
                                </Fragment>}
                            {m.isLoading ? <LoadingIndicator /> : null}
                        </div>
                    ))}
                </div>
            </div>
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