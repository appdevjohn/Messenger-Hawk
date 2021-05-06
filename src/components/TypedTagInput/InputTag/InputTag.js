import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import classes from './InputTag.module.css';

const InputTag = props => {
    const { onValidate, text } = props;
    const [valid, setValid] = useState(null);

    useEffect(() => {
        if (onValidate) {
            onValidate(text).then(result => {
                setValid(result);
            });
        } else {
            setValid(true);
        }
    }, [onValidate, text]);

    let classNames = [classes.InputTag];
    switch (valid) {
        case true:
            classNames.push(classes.valid);
            break;

        case false:
            classNames.push(classes.invalid);
            break;

        default:
            break;
    }

    return (
        <div
            className={classNames.join(' ')}
            onClick={props.onRemove}>
            {text}
        </div>
    )
}

InputTag.propTypes = {
    text: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
    onValidate: PropTypes.func
}

export default InputTag;