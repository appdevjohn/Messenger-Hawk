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
    const { userId, token, history, onReadMessage } = props;
    const user = useSelector(state => state.user);
    const messageUpdates = useSelector(state => state.updates.messages);
    const dispatch = useDispatch();

    const [didFinishLoading, setDidFinishLoading] = useState(false);
    const [convoName, setConvoName] = useState('');
    const [messages, setMessages] = useState([]);

    // Queries for messages when the component is initially displayed.
    useEffect(() => {

        // Fetch this conversation
        const fetchConversation = () => {
            if (token) {
                api.get('/conversations/' + convoId, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                }).then(response => {

                    // Set the state with convo data.
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
                            delivered: 'delivered'
                        }
                    });
                    setConvoName(response.data.conversation.name);
                    setMessages(messages);
                    setDidFinishLoading(true);

                    // Save this conversation to IndexedDB.
                    localDB.getConversationWithId(convoId).then(convo => {
                        const newConvoData = {
                            ...convo,
                            name: response.data.conversation.name,
                            members: response.data.members
                        }
                        localDB.updateConversation(newConvoData);
                    });
                    localDB.deleteMessagesWithConvoId(convoId).then(() => {
                        messages.forEach(msg => {
                            localDB.addMessage(msg);
                        });
                    });

                }).catch(error => {
                    setDidFinishLoading(true);
                    if (error.response) {
                        dispatch(errorActions.setError('Error', error.response.data.message));
                    }
                });
            }
        }

        // Get any messages locally stored.
        localDB.getMessagesWithConvoId(convoId).then(msgs => {
            setMessages(msgs);
            return localDB.getConversationWithId(convoId);

        }).then(convo => {
            if (convo) {
                setConvoName(convo.name);
            }
            fetchConversation();

        }).catch(() => {
            fetchConversation();
        });

    }, [convoId, history, token, userId, setMessages, dispatch]);

    // Update the thread if any new messages have been recieved.
    useEffect(() => {

        // Get new messages for this conversation.
        const updateMessages = messageUpdates.filter(msg => msg.convoId === convoId).map(msg => {
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
                delivered: 'delivered'
            }
        });

        // If there are new messages, add them to the messages state.
        if (updateMessages.length > 0) {
            setMessages(prevMessages => {
                const messagesToAdd = [];

                updateMessages.forEach(updateMsg => {
                    // If a message is already in the thread, skip it.
                    if (prevMessages.findIndex(msg => msg.id === updateMsg.id) === -1) {
                        messagesToAdd.push(updateMsg);
                    }
                });

                return prevMessages.map(msg => ({ ...msg })).concat(messagesToAdd)
            });

            // Clear message updates for this conversation.
            dispatch(updateActions.updateClearMessages(convoId));
        }

    }, [dispatch, convoId, messageUpdates, setMessages]);

    // Sends a message through the API when it sees a new one has been sent.
    useEffect(() => {
        window.scroll(0, document.body.scrollHeight);

        // Get all messages that have not started the delivery process.
        const undeliveredMessages = messages.filter(msg => msg.delivered === 'not delivered');

        for (const message of undeliveredMessages) {

            // Set a new delivered status for this message so it won't be sent twice.
            setMessages(oldMessages => {
                const updatedMessage = {
                    ...message,
                    delivered: 'delivering'
                }
                const newMessages = oldMessages.filter(msg => msg.id !== updatedMessage.id);
                newMessages.push(updatedMessage);
                return newMessages
            });

            // Send the message.
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

                // Update the displayed message with updated information from the server.
                const updatedMessage = {
                    ...message,
                    id: response.data.message.id,
                    convoId: response.data.message.convoId,
                    userFullName: response.data.message.userData.firstName + ' ' + response.data.message.userData.lastName,
                    userUsername: response.data.message.userData.username,
                    timestamp: new Date(response.data.message.createdAt),
                    delivered: 'delivered'
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

    // Sends the ID of the last read message to the API.
    useEffect(() => {
        if (userId && convoId && messages.length > 0) {
            const latestMessage = messages.reduce((latest, current) => {
                if (current.timestamp > latest.timestamp && current.delivered === 'delivered') {
                    return current;
                } else {
                    return latest;
                }
            });
            onReadMessage(convoId, latestMessage.id);
        }
    }, [userId, convoId, messages, onReadMessage]);

    // Adds message to messages state. A different function handles the sending of the message.
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
            delivered: 'not delivered'
        };
        setMessages(oldMessages => {
            const newMessages = oldMessages.map(m => ({ ...m }));
            newMessages.push(newMsg);
            return newMessages;
        });
    }

    return (
        <div className={classes.Messages}>
            <NavBar
                title={convoName}
                leftButton={{ type: 'back', to: '/conversations' }}
                rightButton={{ type: 'options', to: '/conversations/' + convoId + '/options' }} />
            <MessageView
                highlightId={userId || ''}
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