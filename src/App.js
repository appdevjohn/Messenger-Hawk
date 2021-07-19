import { useEffect, useRef } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

import api from './api';
import * as authActions from './store/actions/auth';
import * as errorActions from './store/actions/error';
import * as updateActions from './store/actions/updates';
import Posts from './containers/Posts/Posts';
import Post from './containers/Post/Post';
import Conversations from './containers/Conversations/Conversations';
import NewConversation from './containers/NewConversation/NewConversation';
import Messages from './containers/Conversations/Messages/Messages';
import ConversationOptions from './containers/Conversations/Options/Options';
import Account from './containers/Account/Account';
import AuthForm from './containers/AuthForm/AuthForm';
import Modal from './components/Modal/Modal';

import classes from './App.module.css';

const dummyProps = {
    highlightId: '1',
    senders: [
        {
            id: '1',
            name: 'John Doe',
            img: 'https://dummyimage.com/128/f2efea/000000.png'
        },
        {
            id: '2',
            name: 'Jane Doe',
            img: 'https://dummyimage.com/128/f2efea/000000.png'
        }
    ]
}

function App() {
    const userId = useSelector(state => state.auth.userId);
    const token = useSelector(state => state.auth.token);
    const activated = useSelector(state => state.auth.activated);
    const error = useSelector(state => state.error);
    const dispatch = useDispatch();

    const socketRef = useRef();

    useEffect(() => {
        dispatch(authActions.authCheckState());
    }, [dispatch]);

    useEffect(() => {
        // Initializaing Socket.IO
        if (!socketRef.current && userId) {
            socketRef.current = io(api.defaults.baseURL);

            socketRef.current.on('message', message => {
                dispatch(updateActions.updateAddMessage(message));
            });
            socketRef.current.on('disconnect', () => {
                console.log('Disconnected from Server');
            });

            socketRef.current.on('connect', () => {
                console.log('Connected to Server');
                socketRef.current.emit('subscribe', { userId: userId });
            });
        }

    }, [dispatch, userId]);

    const messageReadHandler = (convoId, messageId) => {
        if (socketRef.current && userId) {
            socketRef.current.emit('read-message', { userId: userId, convoId: convoId, messageId: messageId });
        }
    }

    if (token === null || activated === false) {
        return (
            <div className={classes.App}>
                <AuthForm />
            </div>
        )
    }

    return (
        <div className={classes.App}>
            {error ?
                <Modal title={error.title} body={error.body} options={[
                    {
                        title: 'Dismiss',
                        onClick: () => {
                            dispatch(errorActions.clearError())
                        },
                        disabled: false
                    }
                ]} />
                : null}
            <Switch>
                <Route path="/posts" exact>
                    <Posts userId={userId} token={token} />
                </Route>
                <Route path="/posts/:id" exact>
                    <Post userId={userId} token={token} highlightId={dummyProps.highlightId} senders={dummyProps.senders} />
                </Route>
                <Route path="/conversations" exact>
                    <Conversations userId={userId} token={token} />
                </Route>
                <Route path="/new-conversation" exact>
                    <NewConversation userId={userId} token={token} />
                </Route>
                <Route path="/conversations/:id" exact>
                    <Messages userId={userId} token={token} onReadMessage={messageReadHandler} />
                </Route>
                <Route path="/conversations/:id/options" exact>
                    <ConversationOptions userId={userId} token={token} />
                </Route>
                <Route path="/account" exact>
                    <Account userId={userId} token={token} />
                </Route>
                <Route path="/auth">
                    <AuthForm />
                </Route>
                <Route>
                    <Posts userId={userId} token={token} />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
