import { useState, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '../../../api';
import * as localDB from '../../../localDatabase';
import NavBar from '../../../navigation/NavBar/NavBar';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';

import classes from './Options.module.css';
import backImg from '../../../assets/back.png';

const Options = props => {
    const dispatch = useDispatch();

    const { token } = props;
    const convoId = props.match.params.id;
    const [didFinishLoading, setDidFinishLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [convoName, setConvoName] = useState('');

    useEffect(() => {
        localDB.getConversationWithId(convoId).then(convo => {
            if (convo) {
                setMembers(convo.members);
                setConvoName(convo.name);
            }
        });

        if (token && convoId) {
            api.get('/conversations/' + convoId, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                setMembers(response.data.members);
                setConvoName(response.data.conversation.name);
                setDidFinishLoading(true);

            }).catch(error => {
                console.error(error);
                setDidFinishLoading(true);
            });
        }
    }, [token, convoId, dispatch]);

    useEffect(() => {
        if (token && convoId && convoName.length > 0) {
            const timeout = setTimeout(() => {
                api.put('/conversations/edit', {
                    convoId: convoId,
                    newName: convoName
                }, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                }).catch(error => {
                    console.error(error);
                });
            }, 500);
            return () => {
                clearTimeout(timeout);
            }
        }

    }, [token, convoId, convoName, dispatch]);

    const leaveConversationHandler = () => {
        if (token && convoId) {
            api.put('/conversations/leave', {
                convoId: convoId
            }, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                props.history.push('/conversations');
                localDB.deleteMessagesWithConvoId(convoId);
                localDB.deleteConversationWithId(convoId);

            }).catch(error => {
                console.error(error);
            });
        }
    }

    const memberTable = members.map(member => {
        return (
            <div className={classes.memberRow} key={member.id}>
                {member.firstName} {member.lastName} ({member.username})
            </div>
        )
    })

    const optionsContent = (
        <Fragment>
            <div className={classes.convoNameContainer}>
                <input
                    type="text"
                    placeholder="Conversation Name"
                    value={convoName}
                    onChange={e => setConvoName(e.target.value)} />
            </div>
            <div className={classes.membersContainer}>
                {memberTable}
            </div>
        </Fragment>
    )

    return (
        <div className={classes.Options}>
            <NavBar title="Options" leftButton={{ img: backImg, alt: 'Back', to: '/conversations/' + convoId }} />
            {didFinishLoading ? optionsContent : <LoadingIndicator />}
            <div className="SubmitBtnContainer">
                <button
                    className={['Button', 'SubmitBtn'].join(' ')}
                    onClick={leaveConversationHandler}
                    disabled={!didFinishLoading}>
                    Leave Conversation
                </button>
            </div>
        </div>
    )
}

export default withRouter(Options);