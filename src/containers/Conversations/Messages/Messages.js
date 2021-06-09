import { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { useDispatch } from 'react-redux';

import api from '../../../api';
import * as errorActions from '../../../store/actions/error';
import NavBar from '../../../navigation/NavBar/NavBar';
import MessageView from '../../../components/MessageView/MessageView';
import ComposeBox from '../../../components/ComposeBox/ComposeBox';

import classes from './Messages.module.css';

const Messages = props => {
    const convoId = props.match.params.id;
    const { userId, token, history } = props;
    const dispatch = useDispatch();

    const [convoName, setConvoName] = useState('');
    const [messages, setMessages] = useState([]);

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
                        timestamp: new Date(),
                        content: message.content,
                        type: message.type
                    }
                });
                setConvoName(response.data.conversation.name);
                setMessages(messages);
            }).catch(error => {
                history.replace('/conversations');
                dispatch(errorActions.setError('Error', error.response.data.message));
            });
        }
    }, [convoId, history, token, userId, setMessages, dispatch]);

    useEffect(() => {
        window.scroll(0, document.body.scrollHeight);
    }, [messages.length]);

    const sendMessageHandler = message => {
        api.post('/messages/new', {
            convoId: convoId,
            content: message,
            type: 'text'
        }, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response);
            const newMessage = {
                id: Math.random().toString(),
                userId: userId,
                userFullName: response.data.message.userData.firstName + ' ' + response.data.message.userData.lastName,
                userUsername: response.data.message.userData.username,
                userProfilePic: 'https://dummyimage.com/128/f2efea/000000.png',
                timestamp: new Date(),
                content: response.data.message.content,
                type: response.data.message.type
            };
            setMessages(oldMessages => {
                const newMessages = oldMessages.map(m => ({ ...m }));
                newMessages.push(newMessage);
                return newMessages;
            });
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <div className={classes.Messages}>
            <NavBar title={convoName} back="/conversations" options={'/conversations/' + convoId + '/options'} />
            {userId ?
                <MessageView
                    highlightId={userId}
                    messages={messages} />
                : null}
            <ComposeBox
                sendMessage={sendMessageHandler}
                becameActive={() => {
                    window.scroll(0, document.body.scrollHeight);
                }} />
        </div>
    )
}

export default withRouter(Messages);