import PropTypes from 'prop-types';

import classes from './MessageBubble.module.css';

const MessageBubble = props => {
    let messageClasses = [classes.MessageBubble];
    if (props.highlighted) {
        messageClasses.push(classes.highlighted);
    }
    if (props.delivered !== 'delivered') {
        messageClasses.push(classes.disabled);
    }

    if (props.type === 'image') {
        return (
            <div className={classes.imgDiv}><img src={props.content} alt="Message Attachment" /></div>
        )
    } else {
        return (
            <div><div className={messageClasses.join(' ')}>{props.content}</div></div>
        )
    }
}

MessageBubble.propTypes = {
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    highlighted: PropTypes.bool,
    delivered: PropTypes.oneOf(['delivered', 'delivering', 'not delivered'])
}

export default MessageBubble;