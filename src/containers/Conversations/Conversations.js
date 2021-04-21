import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import TableView from '../../components/TableView/TableView';
import ConvoCell from '../../components/ConvoCell/ConvoCell';

import classes from './Conversations.module.css';

const Conversations = props => {
    return (
        <div className={classes.Conversations}>
            <NavBar title="Conversations" />
            <TableView>
                <ConvoCell data="Conversation 1" />
                <ConvoCell data="Conversation 2" />
                <ConvoCell data="Conversation 3" />
            </TableView>
            <TabBar />
        </div>
    )
}

export default Conversations;