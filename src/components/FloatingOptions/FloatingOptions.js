import { Fragment } from 'react';

import PropTypes from 'prop-types';

import classes from './FloatingOptions.module.css';

const FloatingOptions = props => {
    const options = props.options.map(o => <div className={classes.option} key={o.title}>{o.title}</div>);

    return (
        <Fragment>
            <div className={classes.backdrop} onClick={props.onDismiss}></div>
            <div className={classes.FloatingOptions} style={{ ...props.style }}>{options}</div>
        </Fragment>
    )
}

FloatingOptions.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    })).isRequired,
    onDismiss: PropTypes.func.isRequired,
    style: PropTypes.object
}

export default FloatingOptions;