import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './NavBar.module.css';

const NavBar = props => {

    let leftButton = null;
    if (props.leftButton) {
        const imgElement = <img src={props.leftButton.img} alt={props.leftButton.alt} />
        if (props.leftButton.to) {
            leftButton = <Link to={props.leftButton.to} className={classes.leftButton}>{imgElement}</Link>
        } else if (props.leftButton.onClick) {
            leftButton = <div className={classes.leftButton} role="button" onClick={props.leftButton.onClick}>{imgElement}</div>
        } else {
            leftButton = <div className={classes.leftButton}>{imgElement}</div>
        }
    } else {
        leftButton = <div className={classes.leftButton}></div>
    }

    let rightButton = null;
    if (props.rightButton) {
        const imgElement = <img src={props.rightButton.img} alt={props.rightButton.alt} />
        if (props.rightButton.to) {
            rightButton = <Link to={props.rightButton.to} className={classes.rightButton}>{imgElement}</Link>
        } else if (props.rightButton.onClick) {
            rightButton = <div className={classes.rightButton} role="button" onClick={props.rightButton.onClick}>{imgElement}</div>
        } else {
            rightButton = <div className={classes.rightButton}>{imgElement}</div>
        }
    } else {
        rightButton = <div className={classes.rightButton}></div>
    }

    return (
        <Fragment>
            <div className={classes.NavBar}>
                {leftButton}
                <div className={classes.title}>{props.title}</div>
                {rightButton}
            </div>
            <div className={classes.spacer}></div>
        </Fragment>
    )
}

NavBar.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    leftButton: PropTypes.shape({
        img: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
        to: PropTypes.string,
        onClick: PropTypes.func
    }),
    rightButton: PropTypes.shape({
        img: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
        to: PropTypes.string,
        onClick: PropTypes.func
    })
}

export default NavBar;