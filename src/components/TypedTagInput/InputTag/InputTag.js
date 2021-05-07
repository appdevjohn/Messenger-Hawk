import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import InputTagSpinner from './InputTagSpinner/InputTagSpinner';

import classes from './InputTag.module.css';

const InputTag = props => {
    const { onValidate, text } = props;
    const [valid, setValid] = useState(null);

    useEffect(() => {
        let mounted = true;

        if (onValidate) {
            onValidate(text).then(result => {
                if (mounted) {
                    setValid(result);
                }
            });
        } else {
            if (mounted) {
                setValid(true);
            }
        }

        return () => mounted = false;

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
            {valid === null ? <InputTagSpinner /> : null}
        </div>
    )
}

InputTag.propTypes = {
    text: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
    onValidate: PropTypes.func
}

export default InputTag;