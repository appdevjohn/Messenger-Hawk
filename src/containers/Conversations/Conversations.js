import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';

import classes from './Conversations.module.css';

const Conversations = props => {
    return (
        <div className={classes.Conversations}>
            <NavBar title="Conversations" />
            Conversations
            <TabBar />
        </div>
    )
}

export default Conversations;