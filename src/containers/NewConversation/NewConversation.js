import { useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '../../api';
import * as localDB from '../../localDatabase';
import * as errorActions from '../../store/actions/error';
import NavBar from '../../navigation/NavBar/NavBar';
import TypedTagInput from '../../components/TypedTagInput/TypedTagInput';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './NewConversation.module.css';


const NewConversation = props => {
    const [recipients, setRecipients] = useState([]);
    const [convoName, setConvoName] = useState('');
    const [creatingConvo, setCreatingConvo] = useState(false);
    const dispatch = useDispatch();

    const createConversationHandler = () => {
        setCreatingConvo(true);
        api.post('/conversations/new', {
            name: convoName,
            members: JSON.stringify(recipients)
        }, {
            headers: {
                Authorization: 'Bearer ' + props.token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            const conversation = response.data.conversation;

            setCreatingConvo(false);

            const newConvo = {
                id: conversation.id,
                name: conversation.name,
                unread: false,
                snippet: 'No messages'
            }
            return localDB.addConversation(newConvo).then(() => {
                props.history.push('/conversations/' + conversation.id);
            });

        }).catch(error => {
            setCreatingConvo(false);
            dispatch(errorActions.setError('Error', error.response.data.message));
        });
    }

    return (
        <div className={classes.NewConversation}>
            <NavBar title="New Conversation" leftButton={{ type: 'back', to: '/conversations' }} />
            <TypedTagInput
                placeholder="add user..."
                tags={recipients}
                finalized={creatingConvo}
                addTag={tag => setRecipients(prevState => {
                    return [...prevState, tag];
                })}
                removeTag={tag => {
                    setRecipients(prevState => {
                        return prevState.filter(recipient => recipient !== tag);
                    });
                }}
                removeLastTag={() => {
                    setRecipients(prevState => {
                        const newRecipients = [...prevState];
                        newRecipients.pop();
                        return newRecipients;
                    })
                }}
                onValidateTag={useCallback(text => {
                    return api.get('/validate-recipient/' + text, {
                        headers: {
                            Authorization: 'Bearer ' + props.token,
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        if (response.status === 200) {
                            return response.data.valid
                        } else {
                            return false;
                        }
                    }).catch(() => {
                        return false;
                    });
                }, [props.token])} />
            <div className={classes.convoNameContainer}>
                <input
                    type="text"
                    placeholder="Conversation Name"
                    value={convoName}
                    onChange={e => setConvoName(e.target.value)} />
            </div>
            {creatingConvo ? <LoadingIndicator /> :
                <div className="SubmitBtnContainer">
                    <button
                        className={['Button', 'SubmitBtn'].join(' ')}
                        onClick={createConversationHandler}
                        disabled={recipients.length === 0}>
                        Create New Conversation
                    </button>
                </div>}
        </div>
    )
}

export default withRouter(NewConversation);