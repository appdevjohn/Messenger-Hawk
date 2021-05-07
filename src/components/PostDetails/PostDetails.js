import PropTypes from 'prop-types';

import classes from './PostDetails.module.css';

const PostDetails = props => {
    return (
        <div className={classes.PostDetails}>
            <div className={classes.header}>
                <div className={classes.headerImage}><img src={props.imgSrc} alt={props.name} /></div>
                <div className={classes.headerName}>{props.name} • {props.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div className={classes.title}>{props.title}</div>
            <div className={classes.body}>{props.body}</div>
        </div>
    )
}

PostDetails.propTypes = {
    imgSrc: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired
}

export default PostDetails;