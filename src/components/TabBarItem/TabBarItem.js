import { Link } from 'react-router-dom';

import classes from './TabBarItem.module.css';

const TabBarItem = props => {
    return (
        <Link to={props.link || '/'} className={classes.TabBarItem}>
            Tab Bar Item
        </Link>
    )
}

export default TabBarItem;