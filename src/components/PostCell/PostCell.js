import classes from './PostCell.module.css';

const PostCell = props => {
    return (
        <div className={classes.PostCell}>
            {props.data}
        </div>
    )
}

export default PostCell;