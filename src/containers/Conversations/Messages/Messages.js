import { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import api from '../../../api';
import * as localDB from '../../../localDatabase';
import * as errorActions from '../../../store/actions/error';
import * as updateActions from '../../../store/actions/updates';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';
import NavBar from '../../../navigation/NavBar/NavBar';
import MessageView from '../../../components/MessageView/MessageView';
import ComposeBox from '../../../components/ComposeBox/ComposeBox';

import classes from './Messages.module.css';

const Messages = props => {
    const convoId = props.match.params.id;
    const { userId, token, history } = props;
    const user = useSelector(state => state.user);
    const messageUpdates = useSelector(state => state.updates.messages);
    const dispatch = useDispatch();

    const [didFinishLoading, setDidFinishLoading] = useState(false);
    const [convoName, setConvoName] = useState('');
    const [messages, setMessages] = useState([]);

    // Queries for messages when the component is initially displayed.
    useEffect(() => {
        localDB.getMessagesWithConvoId(convoId).then(msgs => {
            setMessages(msgs);
        });
        localDB.getConversationWithId(convoId).then(convo => {
            if (convo) {
                setConvoName(convo.name);
            }
        })

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
                        convoId: message.convoId,
                        userFullName: message.userData.firstName + ' ' + message.userData.lastName,
                        userUsername: message.userData.username,
                        userProfilePic: 'https://dummyimage.com/128/f2efea/000000.png',
                        timestamp: new Date(message.createdAt),
                        content: message.content,
                        type: message.type,
                        delivered: true
                    }
                });
                setConvoName(response.data.conversation.name);
                setMessages(messages);
                setDidFinishLoading(true);
                localDB.getConversationWithId(convoId).then(convo => {
                    const newConvoData = {
                        ...convo,
                        members: response.data.members
                    }
                    localDB.updateConversation(newConvoData);
                })
                localDB.deleteMessagesWithConvoId(convoId);
                messages.forEach(msg => {
                    localDB.addMessage(msg);
                });

            }).catch(error => {
                setDidFinishLoading(true);
                dispatch(errorActions.setError('Error', error.response.data.message));
            });
        }
    }, [convoId, history, token, userId, setMessages, dispatch]);

    // Update the thread if any new messages have been recieved.
    useEffect(() => {
        const updateMessages = messageUpdates.filter(msg =>
            msg.convoId === convoId &&
            messages.findIndex(msg2 => msg2.id === msg.id) === -1
        ).map(msg => {
            return {
                id: msg.id,
                userId: msg.userId,
                convoId: msg.convoId,
                userFullName: msg.userData.firstName + ' ' + msg.userData.lastName,
                userUsername: msg.userData.username,
                userProfilePic: 'https://dummyimage.com/128/f2efea/000000.png',
                timestamp: new Date(msg.createdAt),
                content: msg.content,
                type: msg.type,
                delivered: true
            }
        });
        if (updateMessages.length > 0) {
            setMessages(prevMessages => prevMessages.map(msg => ({ ...msg })).concat(updateMessages));
        }
        dispatch(updateActions.updateClearMessages);

    }, [dispatch, convoId, messages, messageUpdates]);

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
                const updatedMessage = {
                    ...message,
                    id: response.data.message.id,
                    convoId: response.data.message.convoId,
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
                localDB.addMessage(updatedMessage);

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
            <MessageView
                highlightId={userId}
                messages={messages} />
            {!didFinishLoading ? <LoadingIndicator /> : null}
            <ComposeBox
                sendMessage={sendMessageHandler}
                becameActive={() => {
                    window.scroll(0, document.body.scrollHeight);
                }} />
        </div>
    )
}

export default withRouter(Messages);