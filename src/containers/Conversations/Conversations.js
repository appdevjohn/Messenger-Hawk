import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import TableView from '../../components/TableView/TableView';
import ConvoCell from '../../components/ConvoCell/ConvoCell';

import classes from './Conversations.module.css';

const Conversations = props => {
    return (
        <div className={classes.Conversations}>
            <NavBar title="Conversations" add="/new-conversation" />
            <TableView>
                <ConvoCell name="George Washington" snippet="Here is a bit of my message." />
                <ConvoCell name="John Adams" snippet="Here is a bit of my message." />
                <ConvoCell name="Thomas Jefferson" snippet="Here is a bit of my message." />
                <ConvoCell name="James Madison" snippet="Here is a bit of my message." />
            </TableView>
            <TabBar />
        </div>
    )
}

export default Conversations;