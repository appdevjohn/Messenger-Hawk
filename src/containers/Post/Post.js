import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';

import api from '../../api';
import NavBar from '../../navigation/NavBar/NavBar';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import PostDetails from '../../components/PostDetails/PostDetails';
import MessageView from '../../components/MessageView/MessageView';
import ComposeBox from '../../components/ComposeBox/ComposeBox';

import classes from './Post.module.css';
import backImg from '../../assets/back.png';

const Post = props => {
    const postId = props.match.params.id;
    const token = useSelector(state => state.auth.token);
    const userId = useSelector(state => state.auth.userId);
    const activeGroup = useSelector(state => state.groups.activeGroup);

    const [originalPosterName, setOriginalPosterName] = useState('');
    const [postTimestamp, setPostTimestamp] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postText, setPostText] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scroll(0, document.body.scrollHeight);
    }, [messages.length]);

    useEffect(() => {
        window.scroll(0, 0);
        console.log(postId, activeGroup, token);
        if (postId && activeGroup && token) {
            setIsLoading(true);
            api.get(`/posts/${postId}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log(response.data);
                const post = response.data.post;
                setOriginalPosterName(`${post.userData.firstName} ${post.userData.lastName}`);
                setPostTimestamp(new Date(post.createdAt));
                setPostTitle(post.title);
                setPostText(post.text);
                setIsLoading(false);
            }).catch(error => {
                console.error(error);
                setIsLoading(false);
            });
        }
    }, [postId, activeGroup, token]);

    const sendMessageHandler = message => {
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
    }

    const loadOlderMessagesHandler = () => {

    }

    const uploadFileMessageHandler = () => {

    }

    if (isLoading) {
        return (
            <div className={classes.Post}>
                <NavBar title="John's Post" leftButton={{ img: backImg, alt: 'Back', to: '/posts' }} />
                <LoadingIndicator />
            </div>
        )
    }

    return (
        <div className={classes.Post}>
            <NavBar title="John's Post" leftButton={{ img: backImg, alt: 'Back', to: '/posts' }} />
            <PostDetails
                imgSrc="https://dummyimage.com/128/f2efea/000000.png"
                name={originalPosterName}
                time={postTimestamp || new Date()}
                title={postTitle}
                body={postText} />
            <MessageView
                highlightId={userId || ''}
                messages={messages}
                showLoadOlderMessagesButton={false}
                onLoadOlderMessages={loadOlderMessagesHandler}
                isLoadingOlderMessages={false} />
            <ComposeBox
                sendMessage={sendMessageHandler}
                becameActive={() => window.scroll(0, document.body.scrollHeight)}
                onUploadFile={uploadFileMessageHandler}
                disableUpload={false} />
        </div>
    )
}

export default withRouter(Post);