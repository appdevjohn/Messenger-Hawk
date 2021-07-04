import { useState, useEffect } from 'react';

import api from '../../api';
import * as localDB from '../../localDatabase';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import TableView from '../../components/TableView/TableView';
import ConvoCell from '../../components/ConvoCell/ConvoCell';

import classes from './Conversations.module.css';

const Conversations = props => {
    const { token } = props;
    const [didFinishLoading, setDidFinishLoading] = useState(false);
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        localDB.getConversations().then(convos => {
            setConversations(convos);
        });

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
                        snippet: convo.snippet ? (convo.snippet.type === 'text' ? convo.snippet.content : 'Media') : 'No messages'
                    }
                });
                setConversations(newConversations);
                setDidFinishLoading(true);
                localDB.deleteAllConversations();
                newConversations.forEach(convo => {
                    localDB.addConversation(convo);
                });
    
            }).catch(error => {
                setDidFinishLoading(true);
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
                {!didFinishLoading ? <LoadingIndicator /> : null}
            </TableView>
            <TabBar />
        </div>
    )
}

export default Conversations;