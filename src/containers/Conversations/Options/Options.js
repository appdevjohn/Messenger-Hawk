import { useState, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '../../../api';
import * as errorActions from '../../../store/actions/error';
import NavBar from '../../../navigation/NavBar/NavBar';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';
import TextInput from '../../../components/TextInput/TextInput';
import SubmitButton from '../../../components/SubmitButton/SubmitButton';

import classes from './Options.module.css';

const Options = props => {
    const dispatch = useDispatch();

    const { token } = props;
    const convoId = props.match.params.id;
    const [didFinishLoading, setDidFinishLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [convoName, setConvoName] = useState('');

    useEffect(() => {
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
                dispatch(errorActions.setError('Error', error.response.data.message));
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
                    console.error(error.response.data.message);
                    dispatch(errorActions.setError('Error', error.response.data.message));
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
            }).catch(error => {
                console.error(error.response.data.message);
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
            <TextInput
                type="text"
                placeholder="Conversation Name"
                value={convoName}
                onChange={e => setConvoName(e.target.value)} />
            <div className={classes.membersContainer}>
                {memberTable}
            </div>
        </Fragment>
    )

    return (
        <div className={classes.Options}>
            <NavBar title="Options" back={'/conversations/' + convoId} />
            {didFinishLoading ? optionsContent : <LoadingIndicator />}
            <SubmitButton title="Leave Conversation" onClick={leaveConversationHandler} disabled={!didFinishLoading} />
        </div>
    )
}

export default withRouter(Options);