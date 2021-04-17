import { Fragment } from 'react';

import classes from './NavBar.module.css';

const NavBar = props => {
    return (
        <Fragment>
            <div className={classes.NavBar}>{props.title}</div>
            <div className={classes.spacer}></div>
        </Fragment>
    )
}

export default NavBar;