import classes from './TableView.module.css';

const TableView = props => {
    return (
        <div className={classes.TableView}>
            {props.children}
        </div>
    )
}

export default TableView;