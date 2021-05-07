import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './ConvoCell.module.css';

const ConvoCell = props => {
    return (
        <Link to="/conversations/asdf" className={classes.ConvoCell}>
            <div className={classes.imageContainer}>
                <img src="https://dummyimage.com/128/f2efea/000000.png" alt={props.name} />
            </div>
            <div>
                <div className={classes.name}>{props.name}</div>
                <div className={classes.snippet}>{props.snippet}</div>
            </div>
        </Link>
    )
}

ConvoCell.propTypes = {
    name: PropTypes.string.isRequired,
    snippet: PropTypes.string.isRequired
}

export default ConvoCell;