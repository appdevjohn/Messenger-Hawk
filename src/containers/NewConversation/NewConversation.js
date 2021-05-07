import { useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import NavBar from '../../navigation/NavBar/NavBar';
import TypedTagInput from '../../components/TypedTagInput/TypedTagInput';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './NewConversation.module.css';


const NewConversation = props => {
    const [recipients, setRecipients] = useState([]);
    const [creatingConvo, setCreatingConvo] = useState(false);

    const createConversationHandler = () => {
        /**
         * 1.) Create conversation on server
         * 2.) Get conversation ID
         * 3.) Redirect to /conversations/convoID
         */
        setCreatingConvo(true);
        setTimeout(() => {
            props.history.push('/conversations/asdf');
        }, 1000);
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
                onValidateTag={useCallback((text) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(text.charAt(0) !== 'F');
                        }, 2500);
                    });
                }, [])} />
            {creatingConvo ? <LoadingIndicator /> : <SubmitButton
                title="Create New Conversation"
                disabled={recipients.length === 0}
                onClick={createConversationHandler} />}
        </div>
    )
}

export default withRouter(NewConversation);