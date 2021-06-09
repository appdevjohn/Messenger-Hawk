import { useState, useEffect } from 'react';

import api from '../../api';
import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import TableView from '../../components/TableView/TableView';
import ConvoCell from '../../components/ConvoCell/ConvoCell';

import classes from './Conversations.module.css';

const Conversations = props => {
    const { token } = props;
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        if (token) {
            api.get('/conversations', {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                const newConversations = response.data.conversations.map(convo => {
                    return {
                        id: convo.id,
                        name: convo.name,
                        snippet: 'Snippet Text'
                    }
                });
                setConversations(newConversations);
    
            }).catch(error => {
                console.error(error);
            })
        }
    }, [token]);

    const conversationListings = conversations.map(convo => {
        return <ConvoCell name={convo.name} snippet={convo.snippet} convoId={convo.id} key={convo.id} />
    });
    
    return (
        <div className={classes.Conversations}>
            <NavBar title="Conversations" add="/new-conversation" />
            <TableView>
                {conversationListings}
            </TableView>
            <TabBar />
        </div>
    )
}

export default Conversations;