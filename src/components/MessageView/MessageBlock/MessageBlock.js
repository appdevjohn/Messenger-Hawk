import PropTypes from 'prop-types';

import MessageBubble from './MessageBubble/MessageBubble';

import classes from './MessageBlock.module.css';
import emptyProfilePic from '../../../assets/empty-profile-pic.png';

const MessageBlock = props => {
    let messageBubbles = props.messages.map(message => {
        return <MessageBubble content={message.content} highlighted={props.highlighted} delivered={message.delivered} type={message.type} key={message.id} />
    });

    return (
        <div className={classes.MessageBlock}>
            <div className={classes.senderImageContainer}>
                <img className={classes.senderImage} src={props.senderImg || emptyProfilePic} alt="Profile" />
            </div>
            <div>
                <div className={classes.senderName}>{props.senderName}</div>
                {messageBubbles}
            </div>
        </div>
    )
}

MessageBlock.propTypes = {
    senderImage: PropTypes.string,
    senderName: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.shape({
        content: PropTypes.string,
        type: PropTypes.string,
        id: PropTypes.string
    })).isRequired
}

export default MessageBlock;