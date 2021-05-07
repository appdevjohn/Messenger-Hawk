import PropTypes from 'prop-types';

import classes from './SubmitButton.module.css';

const SubmitButton = props => {
    return (
        <button
            className={props.disabled ? [classes.SubmitButton, classes.disabled].join(' ') : classes.SubmitButton}
            disabled={props.disabled}
            onClick={props.onClick}>
            {props.title}
        </button>
    );
}

SubmitButton.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

export default SubmitButton;