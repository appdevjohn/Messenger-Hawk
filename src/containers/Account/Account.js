import { useState, Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';

import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import Button from '../../components/Button/Button';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import TextInput from '../../components/TextInput/TextInput';

import classes from './Account.module.css';

const Account = props => {
    const firstName = useSelector(state => state.user.firstName);
    const lastName = useSelector(state => state.user.lastName);
    const username = useSelector(state => state.user.username);

    const [isEditing, setIsEditing] = useState(false);
    const [editingFirstName, setFirstName] = useState('');
    const [editingLastName, setLastName] = useState('');
    const [editingUsername, setUsername] = useState('');

    useEffect(() => { setFirstName(firstName || ''); }, [firstName]);
    useEffect(() => { setFirstName(lastName || ''); }, [lastName]);
    useEffect(() => { setFirstName(username || ''); }, [username]);

    const toggleEditHandler = () => {
        if (isEditing) {
            // Save changes
            setIsEditing(false);
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
            <div className={classes.editButtonContainer}>
                <Button title={isEditing ? 'Done' : 'Edit'} onClick={toggleEditHandler} />
            </div>
            <div className={classes.destructiveButtonsContainer}>
                <SubmitButton title="Reset Password" onClick={() => { }} disabled />
                <SubmitButton title="Delete Account" onClick={() => { }} disabled />
            </div>
            <TabBar />
        </div>
    )
}

export default Account;