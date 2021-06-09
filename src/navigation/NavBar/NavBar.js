import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './NavBar.module.css';
import backImg from '../../assets/back.png';
import addImg from '../../assets/add.png';
import optionsImg from '../../assets/options.png';

const NavBar = props => {
    return (
        <Fragment>
            <div className={classes.NavBar}>
                {props.back ?
                    <Link to={props.back} className={classes.back}>
                        <img src={backImg} alt="Back" />
                    </Link>
                    : <div className={classes.back}></div>}
                <div className={classes.title}>{props.title}</div>
                {props.add ?
                    <Link to={props.add} className={classes.option}>
                        <img src={addImg} alt="Add" />
                    </Link>
                    : props.options ?
                        <Link to={props.options} className={classes.option}>
                            <img src={optionsImg} alt="Options" />
                        </Link>
                        : <div className={classes.option}></div>}
            </div>
            <div className={classes.spacer}></div>
        </Fragment>
    )
}

NavBar.propTypes = {
    title: PropTypes.string,
    back: PropTypes.string,
    add: PropTypes.string,
    options: PropTypes.string
}

export default NavBar;