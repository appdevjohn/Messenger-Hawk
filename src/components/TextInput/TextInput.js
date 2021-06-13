import PropTypes from 'prop-types';

import classes from './TextInput.module.css';

const TextInput = props => (
    <div className={classes.container}>
        <input
            className={classes.TextInput}
            type={props.type}
            style={props.style}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            {...props} />
    </div>
)

TextInput.propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

export default TextInput;