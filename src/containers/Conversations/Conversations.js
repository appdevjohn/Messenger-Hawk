import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import api from '../../api';
import * as localDB from '../../localDatabase';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import TableView from '../../components/TableView/TableView';
import ConvoCell from '../../components/ConvoCell/ConvoCell';

import classes from './Conversations.module.css';
import splashClasses from '../SplashView.module.css';
import addImg from '../../assets/add.png';

const Conversations = props => {
    const { token } = props;
    const newMessages = useSelector(state => state.updates.messages);

    const [didFinishLoading, setDidFinishLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [convoUpdates, setConvoUpdates] = useState({});

    useEffect(() => {
        const getConversations = () => {
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
                            unread: convo.snippet ? convo.lastReadMessageId !== convo.snippet.id : false,
                            snippet: convo.snippet ? (convo.snippet.type === 'text' ? convo.snippet.content : 'Attachment') : 'No messages'
                        }
                    });
                    setConversations(newConversations);
                    setDidFinishLoading(true);
                    localDB.deleteAllConversations().then(() => {
                        newConversations.forEach(convo => {
                            localDB.addConversation(convo);
                        });
                    });

                }).catch(error => {
                    setDidFinishLoading(true);
                })
            }
        }

        localDB.getConversations().then(convos => {
            if (!convos) {
                convos = [];
            }
            if (!Array.isArray(convos)) {
                convos = [convos];
            }
            setConversations(convos || []);
            getConversations();
        }).catch(() => {
            getConversations();
        });

    }, [token]);

    // When a new message is recieved, highlight the cell.
    useEffect(() => {
        const updates = {};
        newMessages.forEach(msg => {
            updates[msg.convoId] = msg.content;
        });
        setConvoUpdates(updates);
    }, [newMessages]);

    const conversationListings = conversations.map(convo => {
        return <ConvoCell
            name={convo.name}
            snippet={convoUpdates[convo.id] || convo.snippet}
            convoId={convo.id}
            unread={convoUpdates[convo.id] !== undefined || convo.unread}
            key={convo.id} />
    });

    if (conversations.length === 0) {
        return (
            <div className={splashClasses.SplashView}>
                <NavBar title="Conversations" rightButton={{ img: addImg, alt: 'New Conversation', to: '/new-conversation' }} />
                <div className={splashClasses.SplashViewMessage}>No Conversations. Why not start one?</div>
                <TabBar />
            </div>
        )
    }

    return (
        <div className={classes.Conversations}>
            <NavBar title="Conversations" rightButton={{ img: addImg, alt: 'New Conversation', to: '/new-conversation' }} />
            <TableView>
                {conversationListings}
                {!didFinishLoading ? <LoadingIndicator /> : null}
            </TableView>
            <TabBar />
        </div>
    )
}

export default Conversations;