import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './GroupCell.module.css';

const GroupCell = props => {
    return (
        <Link to={`/groups/${props.id}`} className={classes.GroupCell}>
            <div className={classes.name}>{props.name}</div>
            <div className={classes.description}>{props.description}</div>
        </Link>
    )
}

GroupCell.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
}

export default GroupCell;