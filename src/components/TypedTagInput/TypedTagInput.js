import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import InputTag from '../../components/TypedTagInput/InputTag/InputTag';

import classes from './TypedTagInput.module.css';

const TypedTagInput = props => {
    const [input, setInput] = useState('');

    const inputRef = useRef(null);

    const inputEnteredHandler = event => {
        if (event.key === 'Enter') {
            props.addTag(input);
            setInput('');
        } else if (event.key === 'Backspace' && input.length === 0) {
            props.removeLastTag();
        }
    }

    const displayedTags = props.tags.map(tag => {
        return <InputTag
            key={tag}
            text={tag}
            onValidate={props.onValidateTag}
            onRemove={() => props.removeTag(tag)} />
    });

    return (
        <div
            className={classes.TypedTagInput}
            onClick={() => inputRef.current.focus()}>
            {displayedTags}
            <input
                className={classes.input}
                style={{ width: (input.length * 1.25) + 'ch' }}
                ref={inputRef}
                type="text"
                placeholder={props.placeholder || 'Add...'}
                value={input}
                onChange={event => setInput(event.target.value)}
                onKeyDown={inputEnteredHandler} />
        </div>
    )
}

TypedTagInput.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    addTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    removeLastTag: PropTypes.func.isRequired,
    onValidateTag: PropTypes.func,
    placeholder: PropTypes.string
}

export default TypedTagInput;