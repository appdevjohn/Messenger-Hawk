import { useState } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';

import api from '../../api';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import NavBar from '../../navigation/NavBar/NavBar';

import classes from './NewGroup.module.css';
import backImg from '../../assets/back.png';

const NewGroup = props => {
    const token = useSelector(state => state.auth.token);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
        }).then(response => {
            setIsLoading(false);
            props.history.push('/groups');
        }).catch(error => {
            console.error(error);
            setIsLoading(false);
        });
    }

    return (
        <div className={classes.NewGroup}>
            <NavBar title="New Group" leftButton={{ img: backImg, alt: 'Back', to: '/join-group' }} />
            <div className={classes.inputContainer}>
                <input
                    className={[classes.input, classes.inputName].join(' ')}
                    name="groupName"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)} />
            </div>
            <div className={classes.inputContainer}>
                <textarea
                    className={[classes.input, classes.inputDescription].join(' ')}
                    name="groupDescription" 
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="SubmitBtnContainer"><button className="Button SubmitBtn" onClick={createGroupHandler}>Submit</button></div>
            {isLoading ? <LoadingIndicator /> : null}
        </div>
    )
}

export default withRouter(NewGroup);