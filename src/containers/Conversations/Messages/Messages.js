import { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import api from '../../../api';
import * as localDB from '../../../localDatabase';
import { setError } from '../../../store/actions/error';
import * as updateActions from '../../../store/actions/updates';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';
import NavBar from '../../../navigation/NavBar/NavBar';
import MessageView from '../../../components/MessageView/MessageView';
import ComposeBox from '../../../components/ComposeBox/ComposeBox';

import classes from './Messages.module.css';
import backImg from '../../../assets/back.png';
import optionsImg from '../../../assets/options.png';

const messageFetchLimit = 256;

const fetchMessages = (token, convoId, limit, offset, messagesOnly) => {
    return api.get(`/conversations/${convoId}${messagesOnly ? '/messages' : ''}?limit=${limit}&offset=${offset}`, {
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        const newMessages = response.data.messages.map(message => {
            return {
                id: message.id,
                userId: message.userId,
                convoId: message.convoId,
                userFullName: message.userData.username ? message.userData.firstName + ' ' + message.userData.lastName : 'Deleted Account',
                userUsername: message.userData.username,
                userProfilePic: message.userData.profilePicURL,
                timestamp: new Date(message.createdAt),
                content: message.content,
                type: message.type,
                delivered: 'delivered'
            }
        });

        if (messagesOnly) {
            return { newMessages: newMessages };
        } else {
            return {
                newMessages: newMessages,
                newConvoName: response.data.conversation.name,
                newMembers: response.data.members
            };
        }

    }).catch(error => {
        throw new Error(error);
    });
}

const Messages = props => {
    const convoId = props.match.params.id;
    const { userId, token, history, onReadMessage } = props;
    const user = useSelector(state => state.user);
    const messageUpdates = useSelector(state => state.updates.messages);
    const dispatch = useDispatch();

    const [didFinishLoading, setDidFinishLoading] = useState(false);
    const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [convoName, setConvoName] = useState('');
    const [messages, setMessages] = useState([]);

    // Queries for messages when the component is initially displayed.
    useEffect(() => {

        // Fetch this conversation
        const fetchConversation = () => {
            if (token) {
                fetchMessages(token, convoId, messageFetchLimit, 0, false).then(({ newMessages, newConvoName, newMembers }) => {
                    setConvoName(newConvoName);
                    setMessages(newMessages);
                    setDidFinishLoading(true);

                    // Save this conversation to IndexedDB.
                    localDB.getConversationWithId(convoId).then(convo => {
                        const newConvoData = {
                            ...convo,
                            name: newConvoName,
                            members: newMembers
                        }
                        localDB.updateConversation(newConvoData);
                    });
                    localDB.deleteMessagesWithConvoId(convoId).then(() => {
                        const limitedMessages = newMessages.slice().sort((a, b) => a - b).slice(0, 256);

                        limitedMessages.forEach(msg => {
                            localDB.addMessage(msg);
                        });
                    });

                }).catch(error => {
                    console.error(error);
                    setDidFinishLoading(true);
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
                userProfilePic: msg.userData.profilePicURL,
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

            updateMessages.forEach(msg => {
                localDB.addMessage(msg);
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
                content: message.content
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
            if (latestMessage.delivered === 'delivered') {
                onReadMessage(convoId, latestMessage.id);
            }
        }
    }, [userId, convoId, messages, onReadMessage]);

    // Adds message to messages state. A different function handles the sending of the message.
    const sendMessageHandler = message => {
        const newMsg = {
            id: Math.random().toString(),
            userId: userId,
            userFullName: user.firstName + ' ' + user.lastName,
            userUsername: user.username,
            userProfilePic: user.profilePicURL,
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

    const uploadAttachmentHandler = event => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('attachment', file, file.name);
        formData.append('convoId', convoId);

        setIsUploading(true);

        api.post('/messages/new', formData, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                // console.log(progressEvent);
            }
        }).then(response => {
            setIsUploading(false);

            const message = response.data.message;
            const newMessage = {
                id: message.id,
                userId: message.userId,
                convoId: message.convoId,
                userFullName: message.userData.firstName + ' ' + message.userData.lastName,
                userUsername: message.userData.username,
                userProfilePic: message.userData.profilePicURL,
                timestamp: new Date(message.createdAt),
                content: message.content,
                type: message.type,
                delivered: 'delivered'
            }

            setMessages(oldMessages => {
                const newMessages = oldMessages.map(msg => ({ ...msg }));
                newMessages.push(newMessage);
                return newMessages;
            });
            localDB.addMessage(newMessage);

        }).catch(error => {
            console.error(error);
            setIsUploading(false);
        });
    }

    const loadOlderMessagesHandler = () => {
        setIsLoadingOlderMessages(true);

        fetchMessages(token, convoId, messageFetchLimit, messages.length, true).then(({ newMessages }) => {
            setIsLoadingOlderMessages(false);

            if (newMessages.length === 0) {
                dispatch(setError('Up to Date', 'There are no older messages to load.'));
            } else {
                setMessages(oldMessages => {
                    return oldMessages.map(msg => ({ ...msg })).concat(newMessages);
                });
            }
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <div className={classes.Messages}>
            <NavBar
                title={convoName}
                leftButton={{ img: backImg, alt: 'Back', to: '/conversations' }}
                rightButton={{ img: optionsImg, alt: 'Options', to: '/conversations/' + convoId + '/options' }} />
            <MessageView
                highlightId={userId || ''}
                messages={messages}
                showLoadOlderMessagesButton={messages.length >= messageFetchLimit}
                onLoadOlderMessages={loadOlderMessagesHandler}
                isLoadingOlderMessages={isLoadingOlderMessages} />
            {!didFinishLoading ? <LoadingIndicator /> : null}
            <ComposeBox
                sendMessage={sendMessageHandler}
                becameActive={() => {
                    window.scroll(0, document.body.scrollHeight);
                }}
                onUploadFile={event => uploadAttachmentHandler(event)}
                disableUpload={isUploading} />
        </div>
    )
}

export default withRouter(Messages);