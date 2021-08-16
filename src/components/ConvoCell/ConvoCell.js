import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './ConvoCell.module.css';

const ConvoCell = props => {
    return (
        <Link to={'/conversations/' + props.convoId} className={classes.ConvoCell}>
            <div className={classes.name}>{props.unread ? '*' + props.name : props.name}</div>
            <div className={classes.snippet}>{props.snippet}</div>
        </Link>
    )
}

ConvoCell.propTypes = {
    name: PropTypes.string.isRequired,
    snippet: PropTypes.string.isRequired,
    convoId: PropTypes.string.isRequired,
    unread: PropTypes.bool
}

export default ConvoCell;