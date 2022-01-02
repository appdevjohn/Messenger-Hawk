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
                setMembers(response.data.members);
                setIsLoading(false);
            }).catch(error => {
                console.error(error);
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

    const makeAdminHandler = newAdminId => {
        api.put(`/groups/${groupId}/set-admin`, {
            userId: newAdminId,
            admin: true
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error(error);
        });
    }

    let viewContent = null;
    if (group) {
        viewContent = (
            <Fragment>
                <h1>{group.name}</h1>
                <p>{group.description}</p>
                {members.map(m => (
                    <div className={classes.member} key={m.id}>
                        <div>{m.firstName} {m.lastName}</div>
                        {!m.admin ? <button className="UnemphasizedBtn" onClick={() => makeAdminHandler(m.id)}>Make Admin</button> : null}
                    </div>
                ))}
            </Fragment>
        )
    }

    return (
        <div className={classes.Group}>
            <NavBar title="Group" leftButton={{ img: backImg, alt: 'Back', onClick: props.history.goBack }} />
            {viewContent}
            {isLoading ? <LoadingIndicator /> : null}
            {isMember
                ? <button onClick={leaveGroupHandler}>Leave Group</button>
                : <button onClick={requestJoinHandler}>Join Group</button>}
            {isChangingGroups ? <LoadingIndicator /> : null}
        </div>
    )
}

export default withRouter(Group);