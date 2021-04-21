import classes from './ConvoCell.module.css';

const ConvoCell = props => {
    return (
        <div className={classes.ConvoCell}>
            {props.data}
        </div>
    )
}

export default ConvoCell;