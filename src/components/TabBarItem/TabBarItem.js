import { Link } from 'react-router-dom';

import classes from './TabBarItem.module.css';

const TabBarItem = props => {
    return (
        <Link to={props.link || '/'} className={classes.TabBarItem}>
            <img src={props.image} alt={props.title} className={classes.linkImage} />
        </Link>
    )
}

export default TabBarItem;