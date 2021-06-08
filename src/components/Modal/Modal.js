import PropTypes from 'prop-types';

import Button from '../Button/Button';

import classes from './Modal.module.css';

const Modal = props => {
    const options = props.options.map(option => {
        return <Button title={option.title} onClick={option.onClick} disabled={option.disabled} key={option.title + option.onClick} />
    });

    return (
        <div className={classes.backdrop}>
            <div className={classes.Modal}>
                <div className={classes.content}>
                    <div className={classes.contentTitle}>{props.title}</div>
                    <div className={classes.contentBody}>{props.body}</div>
                </div>
                <div className={classes.options}>
                    {options}
                </div>
            </div>
        </div>
    )
}

Modal.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        disabled: PropTypes.bool
    })).isRequired
}

export default Modal;