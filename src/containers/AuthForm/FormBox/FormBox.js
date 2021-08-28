import PropTypes from 'prop-types';

import classes from './FormBox.module.css';

const FormBox = props => (
    <div className={classes.FormBox}>
        <div className={classes.header}>
            <h2 className={classes.title}>{props.title}</h2>
            <div className={classes.message}>{props.message}</div>
        </div>
        {props.children}
    </div>
)

FormBox.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string
}

export default FormBox;