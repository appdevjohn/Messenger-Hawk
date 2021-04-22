import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import classes from './ComposeBox.module.css';

const ComposeBox = props => {
    const [message, setMessage] = useState('');
    const [active, setActive] = useState(false);
    const inputRef = useRef();

    const containerClasses = [classes.container];
    if (active) {
        containerClasses.push(classes.containerActive);
    }

    return (
        <div className={containerClasses.join(' ')}>
            <div className={classes.ComposeBox}>
                <input
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
                    onFocus={() => {
                        setActive(true);
                        props.becameActive();
                    }}
                    onBlur={() => {
                        setActive(false);
                    }}
                    ref={inputRef} />
            </div>
        </div>
    )
}

ComposeBox.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    becameActive: PropTypes.func.isRequired
}

export default ComposeBox;