import { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import * as authActions from './store/actions/auth';
import Posts from './containers/Posts/Posts';
import Post from './containers/Post/Post';
import Conversations from './containers/Conversations/Conversations';
import NewConversation from './containers/NewConversation/NewConversation';
import Messages from './containers/Messages/Messages';
import Account from './containers/Account/Account';
import AuthForm from './containers/AuthForm/AuthForm';

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
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authActions.authCheckState());
    }, [dispatch]);

    return (
        <div className={classes.App}>
            <Switch>
                <Route path="/posts" exact>
                    <Posts />
                </Route>
                <Route path="/posts/:id" exact>
                    <Post highlightId={dummyProps.highlightId} senders={dummyProps.senders} />
                </Route>
                <Route path="/conversations" exact>
                    <Conversations />
                </Route>
                <Route path="/new-conversation" exact>
                    <NewConversation />
                </Route>
                <Route path="/conversations/:id" exact>
                    <Messages
                        highlightId={dummyProps.highlightId}
                        senders={dummyProps.senders} />
                </Route>
                <Route path="/account" exact>
                    <Account />
                </Route>
                <Route path="/auth">
                    <AuthForm />
                </Route>
                <Route>
                    <Posts />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
