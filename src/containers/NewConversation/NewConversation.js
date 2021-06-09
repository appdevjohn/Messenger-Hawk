import { useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '../../api';
import * as errorActions from '../../store/actions/error';
import NavBar from '../../navigation/NavBar/NavBar';
import TypedTagInput from '../../components/TypedTagInput/TypedTagInput';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './NewConversation.module.css';


const NewConversation = props => {
    const [recipients, setRecipients] = useState([]);
    const [creatingConvo, setCreatingConvo] = useState(false);
    const dispatch = useDispatch();

    const createConversationHandler = () => {
        setCreatingConvo(true);
        api.post('/conversations/new', {
            name: 'New Conversation',
            members: JSON.stringify(recipients)
        }, {
            headers: {
                Authorization: 'Bearer ' + props.token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setCreatingConvo(false);
            props.history.push('/conversations/' + response.data.conversation.id);
        }).catch(error => {
            setCreatingConvo(false);
            dispatch(errorActions.setError('Error', error.response.data.message));
        });
    }

    return (
        <div className={classes.NewConversation}>
            <NavBar title="New Conversation" back="/conversations" />
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
            {creatingConvo ? <LoadingIndicator /> : <SubmitButton
                title="Create New Conversation"
                disabled={recipients.length === 0}
                onClick={createConversationHandler} />}
        </div>
    )
}

export default withRouter(NewConversation);