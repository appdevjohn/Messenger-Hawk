import { useState, useEffect } from 'react';

import NavBar from '../../navigation/NavBar/NavBar';
import MessageView from '../../components/MessageView/MessageView';
import ComposeBox from '../../components/ComposeBox/ComposeBox';

import classes from './Messages.module.css';

const Messages = props => {
    const [messages, setMessages] = useState([
        {
            id: '2',
            senderId: '1',
            timestamp: new Date(Date.now() - 256),
            content: 'sit amet, consectetuer',
            type: 'text'
        },
        {
            id: '1',
            senderId: '1',
            timestamp: new Date(Date.now() - 512),
            content: 'Lorem ipsum dolor',
            type: 'text'
        },
        {
            id: '3',
            senderId: '2',
            timestamp: new Date(Date.now() - 128),
            content: 'adipiscing elit. Aenean commodo ligula',
            type: 'text'
        },
        {
            id: '4',
            senderId: '1',
            timestamp: new Date(Date.now() - 64),
            content: 'eget dolor. Aenean massa.',
            type: 'text'
        },
        {
            id: '5',
            senderId: '2',
            timestamp: new Date(Date.now() - 32),
            content: 'Cum sociis',
            type: 'text'
        },
        {
            id: '6',
            senderId: '2',
            timestamp: new Date(Date.now() - 16),
            content: 'natoque penatibus et magnis dis',
            type: 'text'
        },
        {
            id: '7',
            senderId: '1',
            timestamp: new Date(Date.now() - 8),
            content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
            type: 'text'
        }
    ]);

    useEffect(() => {
        window.scroll(0, document.body.scrollHeight);
    }, [messages.length]);

    return (
        <div className={classes.Messages}>
            <NavBar title="Messages" />
            <MessageView
                highlightId={props.highlightId}
                senders={props.senders}
                messages={messages} />
            <ComposeBox
                sendMessage={message => {
                    const newMessage = {
                        id: Math.random().toString(),
                        senderId: '1',
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

export default Messages;