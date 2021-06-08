import PropTypes from 'prop-types';

import classes from './Button.module.css';

const Button = props => (
    <button
        className={props.disabled ? [classes.Button, classes.disabled].join(' ') : classes.Button}
        disabled={props.disabled}
        onClick={props.onClick}>
        {props.title}
    </button>
)

Button.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

export default Button;