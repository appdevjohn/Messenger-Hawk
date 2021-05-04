import { useState } from 'react';

import NavBar from '../../navigation/NavBar/NavBar';
import PostDetails from '../../components/PostDetails/PostDetails';
import MessageView from '../../components/MessageView/MessageView';
import ComposeBox from '../../components/ComposeBox/ComposeBox';

import classes from './Post.module.css';

const Post = props => {
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

    return (
        <div className={classes.Post}>
            <NavBar title="John's Post" back="/posts" />
            <PostDetails
                imgSrc="https://dummyimage.com/128/f2efea/000000.png"
                name="John Champion"
                time={new Date()}
                title="Does anybody else absolutely love the feeling of airports?"
                body="I know that airports are traditionally hated by everyone for the constant rush and anxiety, but for me, I love them. The feeling of sitting in a seat (especially at night) watching so much happen around me reminds me how small I am in relation to the rest of the world, and I love this feeling so much. Does anyone else feel like this in airports?" />
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

export default Post;