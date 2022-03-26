import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';

import api from '../../api';
import { setError } from '../../store/actions/error';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import NavBar from '../../navigation/NavBar/NavBar';

import classes from './NewGroup.module.css';
import backImg from '../../assets/back.png';

const NewGroup = props => {
    const groupId = props.match.params.id;
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [isGettingData, setIsGettingData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (groupId && token) {
            const controller = new AbortController();
            setIsGettingData(true);

            api.get(`/groups/${groupId}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            }).then(response => {
                setName(response.data.group.name);
                setDescription(response.data.group.description);
                setIsGettingData(false);

            }).catch(error => {
                console.error(error);
                setIsGettingData(false);
                dispatch(setError('Error Getting Group Data', error.response.data.message || 'There was a server error querying this data.'));
            });

            return () => {
                controller.abort();
            }
        }
    }, [groupId, token, dispatch])

    const createGroupHandler = () => {
        setIsLoading(true);

        api.post('/groups/new', {
            name: name,
            description: description
        }, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(() => {
            setIsLoading(false);
            props.history.push('/groups');

        }).catch(error => {
            console.error(error);
            setIsLoading(false);
            dispatch(setError('Error Creating Group', error.response.data.message || 'There was a server error querying this data.'));
        });
    }

    const updateGroupHandler = id => {
        setIsLoading(true);

        api.put('/groups/edit', {
            id: id,
            name: name,
            description: description
        }, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(() => {
            props.history.goBack();

        }).catch(error => {
            console.error(error);
            setIsLoading(false);
            dispatch(setError('Error Editing Group', error.response?.data?.message || 'There was a server error querying this data.'));
        })
    }

    return (
        <div className={classes.NewGroup}>
            <NavBar
                title={groupId ? 'Edit Group' : 'New Group'}
                leftButton={{ img: backImg, alt: 'Back', to: !groupId ? '/join-group' : null, onClick: groupId ? props.history.goBack : null }} />
            <input
                className={classes.nameInput}
                name="groupName"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={isLoading || isGettingData} />
            <textarea
                className={classes.descriptionInput}
                name="groupDescription"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={isLoading || isGettingData} />
            <div className="SubmitBtnContainer">
                <button
                    className="Button SubmitBtn"
                    onClick={groupId ? updateGroupHandler.bind(this, groupId) : createGroupHandler}
                    disabled={isLoading || isGettingData}>
                    {groupId ? 'Update' : 'Create'}
                </button>
            </div>
            {isLoading || isGettingData ? <LoadingIndicator /> : null}
        </div>
    )
}

export default withRouter(NewGroup);