import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './TabBarItem.module.css';

const TabBarItem = props => {
    return (
        <Link to={props.link || '/'} className={classes.TabBarItem}>
            <img src={props.image} alt={props.title} className={classes.linkImage} />
        </Link>
    )
}

TabBarItem.propTypes = {
    link: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}

export default TabBarItem;