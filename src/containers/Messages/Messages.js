import { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { useDispatch } from 'react-redux';

import api from '../../api';
import * as errorActions from '../../store/actions/error';
import NavBar from '../../navigation/NavBar/NavBar';
import MessageView from '../../components/MessageView/MessageView';
import ComposeBox from '../../components/ComposeBox/ComposeBox';

import classes from './Messages.module.css';

const Messages = props => {
    const convoId = props.match.params.id;
    const { userId, token, history } = props;
    const dispatch = useDispatch();

    const [convoName, setConvoName] = useState('');
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (token) {
            api.get('/conversations/' + convoId, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                const members = response.data.members.map(member => {
                    return {
                        id: member.id,
                        name: member.firstName + ' ' + member.lastName,
                        img: 'https://dummyimage.com/128/f2efea/000000.png'
                    }
                });
                const messages = response.data.messages.map(message => {
                    return {
                        id: message.id,
                        userId: message.userId,
                        timestamp: new Date(),
                        content: message.content,
                        type: message.type
                    }
                });
                setConvoName(response.data.conversation.name);
                setMembers(members);
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

    return (
        <div className={classes.Messages}>
            <NavBar title={convoName} back="/conversations" />
            {userId ?
                <MessageView
                    highlightId={userId}
                    senders={members}
                    messages={messages} />
                : null}
            <ComposeBox
                sendMessage={message => {
                    const newMessage = {
                        id: Math.random().toString(),
                        userId: userId,
                        timestamp: new Date(),
                        content: message,
                        type: 'text'
                    };
                    setMessages(oldMessages => {
                        const newMessages = oldMessages.map(m => ({ ...m }));
                        newMessages.push(newMessage);
                        return newMessages;
                    });
                }}
                becameActive={() => {
                    window.scroll(0, document.body.scrollHeight);
                }} />
        </div>
    )
}

export default withRouter(Messages);