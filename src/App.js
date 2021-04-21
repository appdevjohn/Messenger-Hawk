import { Switch, Route } from 'react-router-dom';

import Posts from './containers/Posts/Posts';
import Conversations from './containers/Conversations/Conversations';
import Messages from './containers/Messages/Messages';

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
    return (
        <div className={classes.App}>
            <Switch>
                <Route path="/posts" exact>
                    <Posts />
                </Route>
                <Route path="/posts/:id" exact>
                    <div>This view is not yet ready.</div>
                </Route>
                <Route path="/conversations" exact>
                    <Conversations />
                </Route>
                <Route path="/conversations/:id" exact>
                    <Messages
                        highlightId={dummyProps.highlightId}
                        senders={dummyProps.senders} />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
