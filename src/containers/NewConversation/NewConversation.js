import { useState, useCallback } from 'react';

import NavBar from '../../navigation/NavBar/NavBar';
import TypedTagInput from '../../components/TypedTagInput/TypedTagInput';

import classes from './NewConversation.module.css';


const NewConversation = props => {
    const [recipients, setRecipients] = useState([]);

    return (
        <div className={classes.NewConversation}>
            <NavBar title="New Conversation" back="/conversations" />
            <TypedTagInput
                placeholder="Username..."
                tags={recipients}
                addTag={tag => setRecipients(prevState => {
                    return [...prevState, tag];
                })}
                removeTag={tag => {
                    setRecipients(prevState => {
                        return prevState.filter(recipient => recipient !== tag);
                    });
                }}
                onValidateTag={useCallback((text) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(text.charAt(0) !== 'F');
                        }, 500);
                    });
                }, [])} />
        </div>
    )
}

export default NewConversation;