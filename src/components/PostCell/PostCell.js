import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import classes from './PostCell.module.css';
import emptyProfilePic from '../../assets/empty-profile-pic.png';

const PostCell = props => {
    return (
        <Link to={`/posts/${props.postId}`} className={classes.PostCell}>
            <div className={classes.header}>
                <div className={classes.headerImage}><img src={props.imgSrc || emptyProfilePic} alt={props.name} /></div>
                <div className={classes.headerName}>{props.name} • {props.time.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div className={classes.title}>{props.title}</div>
            <div className={classes.body}>{props.body}</div>
        </Link>
    )
}

PostCell.propTypes = {
    postId: PropTypes.string.isRequired,
    imgSrc: PropTypes.string,
    name: PropTypes.string.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired
}

export default PostCell;