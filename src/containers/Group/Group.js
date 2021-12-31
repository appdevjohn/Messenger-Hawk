import { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import api from '../../api';
import NavBar from '../../navigation/NavBar/NavBar';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './Group.module.css';
import backImg from '../../assets/back.png';

const Group = props => {
    const groupId = props.match.params.id;
    const token = useSelector(state => state.auth.token);
    const userId = useSelector(state => state.auth.userId);

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isJoiningGroup, setIsJoiningGroup] = useState(false);

    useEffect(() => {
        if (token && groupId) {
            setIsLoading(true);

            api.get(`/groups/${groupId}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log(response.data);
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
        if (groupId && userId) {
            setIsJoiningGroup(true);

            api.post(`/groups/${groupId}/add-user`, {
                userId: userId,
                approved: true
            }, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log(response);
                setIsJoiningGroup(false);
            }).catch(error => {
                console.error(error);
                setIsJoiningGroup(false);
            });
        }
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
            <NavBar title="Group" leftButton={{ img: backImg, alt: 'Back', to: '/' }} />
            {viewContent}
            {isLoading ? <LoadingIndicator /> : null}
            <button onClick={requestJoinHandler} disabled={!groupId || !userId}>Join Group</button>
            {isJoiningGroup ? <LoadingIndicator /> : null}
        </div>
    )
}

export default withRouter(Group);