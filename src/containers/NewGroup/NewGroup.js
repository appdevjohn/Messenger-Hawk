import { useState } from 'react';

import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import NavBar from '../../navigation/NavBar/NavBar';

import classes from './NewGroup.module.css';
import backImg from '../../assets/back.png';

const NewGroup = props => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createGroupHandler = () => {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 500)
    }

    return (
        <div className={classes.NewGroup}>
            <NavBar title="New Group" leftButton={{ img: backImg, alt: 'Back', to: '/add-group' }} />
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

export default NewGroup;