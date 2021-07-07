import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './NavBar.module.css';
import backImg from '../../assets/back.png';
import addImg from '../../assets/add.png';
import optionsImg from '../../assets/options.png';

const NavBar = props => {

    let rightButtonImg;
    let rightButtonAlt;

    if (props.rightButton) {
        switch (props.rightButton.type) {
            case 'add':
                rightButtonImg = addImg;
                rightButtonAlt = 'Add';
                break;

            case 'options':
                rightButtonImg = optionsImg;
                rightButtonAlt = 'Options';
                break;

            default:
                rightButtonImg = null;
                rightButtonAlt = props.rightButton.type;
                break;
        }
    }

    return (
        <Fragment>
            <div className={classes.NavBar}>
                {props.leftButton ?
                    <Link to={props.leftButton.to} className={classes.leftButton}>
                        <img src={backImg} alt="Back" />
                    </Link>
                    : <div className={classes.leftButton}></div>}
                <div className={classes.title}>{props.title}</div>
                {props.rightButton ?
                    <Link to={props.rightButton.to} className={classes.rightButton}>
                        {rightButtonImg ? <img src={rightButtonImg} alt={rightButtonAlt} /> : rightButtonAlt}
                    </Link>
                    : <div className={classes.rightButton}></div>}
            </div>
            <div className={classes.spacer}></div>
        </Fragment>
    )
}

NavBar.propTypes = {
    title: PropTypes.string,
    leftButton: PropTypes.shape({
        type: PropTypes.string,
        to: PropTypes.string
    }),
    rightButton: PropTypes.shape({
        type: PropTypes.string,
        to: PropTypes.string
    })
}

export default NavBar;