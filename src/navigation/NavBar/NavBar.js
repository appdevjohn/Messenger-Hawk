import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import classes from './NavBar.module.css';

const NavBar = props => {
    return (
        <Fragment>
            <div className={classes.NavBar}>
                <div className={classes.back}>
                    {props.back ? <Link to={props.back}>Back</Link> : null}
                </div>
                <div className={classes.title}>{props.title}</div>
                <div className={classes.add}>
                    {props.add ? <Link to={props.add}>Add</Link> : null}
                </div>
            </div>
            <div className={classes.spacer}></div>
        </Fragment>
    )
}

export default NavBar;