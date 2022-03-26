import { useState, Fragment, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import api from '../../api';
import * as localDB from '../../localDatabase';
import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';
import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import Modal from '../../components/Modal/Modal';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './Account.module.css';
import logoutImg from '../../assets/logout.png';

const Account = props => {
    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);
    const userId = useSelector(state => state.auth.userId);
    const firstName = useSelector(state => state.user.firstName);
    const lastName = useSelector(state => state.user.lastName);
    const username = useSelector(state => state.user.username);
    const profilePicURL = useSelector(state => state.user.profilePicURL);

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingFirstName, setFirstName] = useState('');
    const [editingLastName, setLastName] = useState('');
    const [editingUsername, setUsername] = useState('');
    const [editingProfilePic, setEditingProfilePic] = useState(null);
    const [isConfirmingDeleteAccount, setIsConfirmingDeleteAccount] = useState(false);

    useEffect(() => { setFirstName(firstName || ''); }, [firstName]);
    useEffect(() => { setLastName(lastName || ''); }, [lastName]);
    useEffect(() => { setUsername(username || ''); }, [username]);

    const uploadRef = useRef(null);

    const uploadProfilePicHandler = () => {
        const formData = new FormData();
        formData.append('image', editingProfilePic, editingProfilePic.name);

        api.put('/users/edit-image', formData, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                console.log(progressEvent);
            }
        }).then(response => {
            const userData = response.data.user;
            dispatch(userActions.setUser(userData.firstName, userData.lastName, userData.username, userData.email, userData.profilePicURL));
            localDB.ensureUserIsSaved(userData);

            setEditingProfilePic(null);

        }).catch(error => {
            console.error(error);
        });
    }

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
                dispatch(userActions.setUser(userData.firstName, userData.lastName, userData.username, userData.email, userData.profilePicURL));
                localDB.ensureUserIsSaved(userData);

            }).catch(error => {
                console.error(error);
                setIsEditing(false);
                setIsLoading(false);
            });

        } else {
            setIsEditing(true);
        }
    }

    const deleteAccountHandler = () => {
        setIsConfirmingDeleteAccount(false);
        dispatch(authActions.startDeleteAccount(token));
    }

    let localProfilePicURL = null;
    if (editingProfilePic) {
        localProfilePicURL = URL.createObjectURL(editingProfilePic);
    }

    const displayedInfoUI = (
        <Fragment>
            <div className={classes.fullName}>{firstName + ' ' + lastName}</div>
            <div className={classes.username}>{username}</div>
        </Fragment>
    )

    const editingInfoUI = (
        <Fragment>
            <div className={classes.editingInputContainer}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={editingFirstName}
                    onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className={classes.editingInputContainer}>
                <input
                    type="text"
                    placeholder="Last Name"
                    value={editingLastName}
                    onChange={e => setLastName(e.target.value)} />
            </div>
            <div className={classes.editingInputContainer}>
                <input
                    type="text"
                    placeholder="username"
                    value={editingUsername}
                    onChange={e => setUsername(e.target.value)} />
            </div>
        </Fragment>
    )

    return (
        <div className={classes.Account}>
            {isConfirmingDeleteAccount ? <Modal
                title="Delete Account"
                body="If you delete your account, any messages you have sent won't be deleted until everyone leaves the conversations they were sent in."
                options={[
                    { title: 'Cancel', onClick: () => setIsConfirmingDeleteAccount(false) },
                    { title: 'Delete', onClick: deleteAccountHandler },
                ]} /> : null}

            <NavBar title="Account" rightButton={{ img: logoutImg, alt: 'Log Out', to: '/auth/logout' }} />

            <div className={classes.profilePicture} onClick={() => { uploadRef.current.click() }}>
                {(localProfilePicURL || profilePicURL) ?
                    <img src={localProfilePicURL || profilePicURL} alt={`${firstName} ${lastName}`} /> :
                    <div>No Picture Uploaded</div>}
                <div className={classes.profilePictureEdit}>Edit</div>
            </div>
            <input type="file" onChange={e => setEditingProfilePic(e.target.files[0])} ref={uploadRef} style={{ display: 'none' }} />
            {editingProfilePic ? <div className={classes.imageUploadOptions}>
                <button
                    className="Button"
                    onClick={uploadProfilePicHandler}>
                    Upload
                </button>
                <button
                    className="Button"
                    onClick={() => setEditingProfilePic(null)}>
                    Cancel
                </button>
            </div> : null}

            {isEditing ? editingInfoUI : displayedInfoUI}
            {isLoading ? <LoadingIndicator /> :
                <div className={classes.editButtonContainer}>
                    <button
                        className="Button"
                        onClick={toggleEditHandler}>
                        {isEditing ? 'Done' : 'Edit'}
                    </button>
                </div>
            }

            <div className={classes.destructiveButtonsContainer}>
                <div className="SubmitBtnContainer">
                    <button
                        className={['Button', 'SubmitBtn'].join(' ')}
                        onClick={() => setIsConfirmingDeleteAccount(true)}>
                        Delete Account
                    </button>
                </div>
            </div>
            <TabBar />
        </div>
    )
}

export default Account;