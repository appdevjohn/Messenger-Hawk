import PropTypes from 'prop-types';

import classes from './TextInput.module.css';

const TextInput = props => (
    <input
        className={classes.TextInput}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        {...props} />
)

TextInput.propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

export default TextInput;