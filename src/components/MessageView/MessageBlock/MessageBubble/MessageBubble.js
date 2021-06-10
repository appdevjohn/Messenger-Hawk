import PropTypes from 'prop-types';

import classes from './MessageBubble.module.css';

const MessageBubble = props => {
    let messageClasses = [classes.MessageBubble];
    if (props.highlighted) {
        messageClasses.push(classes.highlighted);
    }
    if (!props.delivered) {
        messageClasses.push(classes.disabled);
    }

    return (
        <div><div className={messageClasses.join(' ')}>{props.text}</div></div>
    )
}

MessageBubble.propTypes = {
    text: PropTypes.string.isRequired,
    highlighted: PropTypes.bool,
    delivered: PropTypes.bool.isRequired
}

export default MessageBubble;