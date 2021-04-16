import MessageBlock from '../../components/MessageBlock/MessageBlock';

import classes from './MessageView.module.css';

const MessageView = props => {
    const sortedMessages = props.messages.map(msg => ({ ...msg })).sort((a, b) => a.timestamp - b.timestamp);

    // Consecutive messages sent from the same sender must be grouped together.
    const messageBlocks = [];
    for (let i = 0; i < sortedMessages.length; i++) {
        const message = sortedMessages[i];

        if (message.type === 'text') {
            if (messageBlocks.length > 0 &&
                messageBlocks[messageBlocks.length - 1].senderId === message.senderId && 
                Math.abs(messageBlocks[messageBlocks.length - 1].messages[messageBlocks[messageBlocks.length - 1].messages.length - 1].timestamp - message.timestamp) < 60000) {

                messageBlocks[messageBlocks.length - 1].messages.push({ ...message });
                
            } else {
                const sender = props.senders.find(sender => sender.id === message.senderId);
                const newBlock = {
                    senderId: message.senderId,
                    senderImg: sender.img,
                    senderName: sender.name,
                    messages: [{ ...message }]
                }
                messageBlocks.push(newBlock);
            }
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

export default MessageView;