import { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import api from '../../../api';
import * as errorActions from '../../../store/actions/error';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';
import NavBar from '../../../navigation/NavBar/NavBar';
import MessageView from '../../../components/MessageView/MessageView';
import ComposeBox from '../../../components/ComposeBox/ComposeBox';

import classes from './Messages.module.css';

const Messages = props => {
    const convoId = props.match.params.id;
    const { userId, token, history } = props;
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [didFinishLoading, setDidFinishLoading] = useState(false);
    const [convoName, setConvoName] = useState('');
    const [messages, setMessages] = useState([]);

    // Queries for messages when the component is initially displayed.
    useEffect(() => {
        if (token) {
            api.get('/conversations/' + convoId, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                const messages = response.data.messages.map(message => {
                    return {
                        id: message.id,
                        userId: message.userId,
                        userFullName: message.userData.firstName + ' ' + message.userData.lastName,
                        userUsername: message.userData.username,
                        userProfilePic: 'https://dummyimage.com/128/f2efea/000000.png',
                        timestamp: message.createdAt,
                        content: message.content,
                        type: message.type,
                        delivered: true
                    }
                });
                setConvoName(response.data.conversation.name);
                setMessages(messages);
                setDidFinishLoading(true);

            }).catch(error => {
                setDidFinishLoading(true);
                history.replace('/conversations');
                dispatch(errorActions.setError('Error', error.response.data.message));
            });
        }
    }, [convoId, history, token, userId, setMessages, dispatch]);

    // Sends a message through the API when it sees a new one has been sent.
    useEffect(() => {
        window.scroll(0, document.body.scrollHeight);

        const undeliveredMessages = messages.filter(msg => msg.delivered === false);
        for (const message of undeliveredMessages) {
            api.post('/messages/new', {
                convoId: convoId,
                content: message.content,
                type: 'text'
            }, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log(response);
                const updatedMessage = {
                    ...message,
                    id: response.data.message.id,
                    userFullName: response.data.message.userData.firstName + ' ' + response.data.message.userData.lastName,
                    userUsername: response.data.message.userData.username,
                    timestamp: new Date(response.data.message.createdAt),
                    delivered: true
                }
                setMessages(oldMessages => {
                    const newMessages = oldMessages.filter(msg => msg.id !== message.id);
                    newMessages.push(updatedMessage);
                    return newMessages
                });

            }).catch(error => {
                console.error(error);
            });
        }

    }, [token, convoId, messages, setMessages]);

    const sendMessageHandler = message => {
        const newMsg = {
            id: Math.random().toString(),
            userId: userId,
            userFullName: user.firstName + ' ' + user.lastName,
            userUsername: user.username,
            userProfilePic: 'https://dummyimage.com/128/f2efea/000000.png',
            timestamp: new Date(),
            content: message,
            type: 'text',
            delivered: false
        };
        setMessages(oldMessages => {
            const newMessages = oldMessages.map(m => ({ ...m }));
            newMessages.push(newMsg);
            return newMessages;
        });
    }

    return (
        <div className={classes.Messages}>
            <NavBar title={convoName} back="/conversations" options={'/conversations/' + convoId + '/options'} />
            {didFinishLoading ?
                <MessageView
                    highlightId={userId}
                    messages={messages} />
                : <LoadingIndicator />}
            <ComposeBox
                sendMessage={sendMessageHandler}
                becameActive={() => {
                    window.scroll(0, document.body.scrollHeight);
                }} />
        </div>
    )
}

export default withRouter(Messages);