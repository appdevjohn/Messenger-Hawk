import PropTypes from 'prop-types';

import classes from './MessageBubble.module.css';

const MessageBubble = props => {
    let messageClasses = classes.MessageBubble;
    if (props.highlighted) {
        messageClasses = [classes.MessageBubble, classes.highlighted].join(' ');
    }
    return (
        <div><div className={messageClasses}>{props.text}</div></div>
    )
}

MessageBubble.propTypes = {
    text: PropTypes.string.isRequired
}

export default MessageBubble;