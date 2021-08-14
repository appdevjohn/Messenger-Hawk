import PropTypes from 'prop-types';

import MessageBlock from './MessageBlock/MessageBlock';

import classes from './MessageView.module.css';

const MessageView = props => {
    const sortedMessages = props.messages.map(msg => ({ ...msg })).sort((a, b) => a.timestamp - b.timestamp);

    // Consecutive messages sent from the same sender must be grouped together.
    const messageBlocks = [];
    for (let i = 0; i < sortedMessages.length; i++) {
        const message = sortedMessages[i];

        if (messageBlocks.length > 0 &&
            messageBlocks[messageBlocks.length - 1].senderId === message.userId &&
            Math.abs(messageBlocks[messageBlocks.length - 1].messages[messageBlocks[messageBlocks.length - 1].messages.length - 1].timestamp - message.timestamp) < 60000) {

            messageBlocks[messageBlocks.length - 1].messages.push({ ...message });

        } else {
            const newBlock = {
                senderId: message.userId,
                senderImg: message.userProfilePic,
                senderName: message.userFullName,
                messages: [{ ...message }]
            }
            messageBlocks.push(newBlock);
        }
    }

    return (
        <div className={classes.MessageView}>
            {messageBlocks.map(block => {
                return <MessageBlock
                    senderName={block.senderName}
                    senderImg={block.senderImg}
                    messages={block.messages}
                    highlighted={block.senderId === props.highlightId}
                    key={JSON.stringify(block.messages)} />
            })}
        </div>
    )
}

MessageView.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        userId: PropTypes.string,
        timestamp: PropTypes.instanceOf(Date),
        content: PropTypes.string,
        type: PropTypes.string
    })).isRequired,
    highlightId: PropTypes.string.isRequired
}

export default MessageView;