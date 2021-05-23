import { useDispatch } from 'react-redux';

import * as authActions from '../../store/actions/auth';
import TabBar from '../../navigation/TabBar/TabBar';

import classes from './Account.module.css';

const Account = props => {
    const dispatch = useDispatch();

    const logOutHandler = () => {
        dispatch(authActions.startLogOut());
    }

    return (
        <div className={classes.Account}>
            <button onClick={logOutHandler}>Log Out</button>
            <TabBar />
        </div>
    )
}

export default Account;