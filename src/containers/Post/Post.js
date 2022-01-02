import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';

import api from '../../api';
import * as localDB from '../../localDatabase';
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
    const user = useSelector(state => state.user);

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
        if (postId && token) {
            setIsLoading(true);
            api.get(`/posts/${postId}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                const post = response.data.post;
                setOriginalPosterName(`${post.userData.firstName} ${post.userData.lastName}`);
                setPostTimestamp(new Date(post.createdAt));
                setPostTitle(post.title);
                setPostText(post.text);

                const messages = response.data.messages.map(m => {
                    return {
                        id: m.id,
                        userId: m.userId,
                        postId: m.postId,
                        userFullName: m.userData.firstName + ' ' + m.userData.lastName,
                        userUsername: m.userData.username,
                        userProfilePic: m.userData.profilePicURL,
                        timestamp: new Date(m.createdAt),
                        content: m.content,
                        type: m.type,
                        delivered: 'delivered'
                    }
                });
                setMessages(messages);

                setIsLoading(false);
            }).catch(error => {
                console.error(error);
                setIsLoading(false);
            });
        }
    }, [postId, token]);

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
            api.post('/posts/add-message', {
                postId: postId,
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
                    postId: response.data.message.postId,
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

    }, [messages, postId, token])

    const sendMessageHandler = message => {
        const newMessage = {
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