import { useState, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import api from '../../api';
import * as localDB from '../../localDatabase';
import * as userActions from '../../store/actions/user';
import * as errorActions from '../../store/actions/error';
import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import Button from '../../components/Button/Button';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import TextInput from '../../components/TextInput/TextInput';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './Account.module.css';

const Account = props => {
    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);
    const userId = useSelector(state => state.auth.userId);
    const firstName = useSelector(state => state.user.firstName);
    const lastName = useSelector(state => state.user.lastName);
    const username = useSelector(state => state.user.username);

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingFirstName, setFirstName] = useState('');
    const [editingLastName, setLastName] = useState('');
    const [editingUsername, setUsername] = useState('');

    useEffect(() => { setFirstName(firstName || ''); }, [firstName]);
    useEffect(() => { setLastName(lastName || ''); }, [lastName]);
    useEffect(() => { setUsername(username || ''); }, [username]);

    const toggleEditHandler = () => {
        if (isEditing) {

            // Save changes
            setIsLoading(true);
            api.put('/users/edit', {
                userId: userId,
                firstName: editingFirstName,
                lastName: editingLastName,
                username: editingUsername
            }, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                setIsEditing(false);
                setIsLoading(false);

                const userData = response.data.user;
                dispatch(userActions.setUser(userData.firstName, userData.lastName, userData.username, userData.email));
                localDB.ensureUserIsSaved(userData);

            }).catch(error => {
                setIsEditing(false);
                setIsLoading(false);

                dispatch(errorActions.setError('Error', error.response.data.message));
            });

        } else {
            setIsEditing(true);
        }
    }

    const displayedInfoUI = (
        <Fragment>
            <div className={classes.fullName}>{firstName + ' ' + lastName}</div>
            <div className={classes.username}>{username}</div>
        </Fragment>
    )

    const editingInfoUI = (
        <Fragment>
            <TextInput
                type="text"
                placeholder="First Name"
                value={editingFirstName}
                onChange={e => setFirstName(e.target.value)} />
            <TextInput
                type="text"
                placeholder="Last Name"
                value={editingLastName}
                onChange={e => setLastName(e.target.value)} />
            <TextInput
                type="text"
                placeholder="username"
                value={editingUsername}
                onChange={e => setUsername(e.target.value)} />
        </Fragment>
    )

    return (
        <div className={classes.Account}>
            <NavBar title="Account" rightButton={{ type: 'Log Out', to: '/auth/logout' }} />
            <div className={classes.profilePicture}>Profile Picture</div>
            {isEditing ? editingInfoUI : displayedInfoUI}
            {isLoading ? <LoadingIndicator /> :
                <div className={classes.editButtonContainer}>
                    <Button title={isEditing ? 'Done' : 'Edit'} onClick={toggleEditHandler} />
                </div>
            }
            <div className={classes.destructiveButtonsContainer}>
                <SubmitButton title="Reset Password" onClick={() => { }} disabled />
                <SubmitButton title="Delete Account" onClick={() => { }} disabled />
            </div>
            <TabBar />
        </div>
    )
}

export default Account;