import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import classes from './ComposeBox.module.css';

const ComposeBox = props => {
    const [message, setMessage] = useState('');
    const inputRef = useRef();

    return (
        <div className={classes.ComposeBox}>
            <div><input
                className={classes.Input}
                type="text"
                placeholder="Message"
                value={message}
                onChange={event => setMessage(event.target.value)}
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        props.sendMessage(message);
                        setMessage('');
                        inputRef.current.focus();
                    }
                }}
                onFocus={props.becameActive}
                ref={inputRef} /></div>
            <div><button
                className={classes.Button}
                onClick={() => {
                    props.sendMessage(message);
                    setMessage('');
                    inputRef.current.focus();
                }}></button></div>
        </div>
    )
}

ComposeBox.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    becameActive: PropTypes.func.isRequired
}

export default ComposeBox;