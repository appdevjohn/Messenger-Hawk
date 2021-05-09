import { useState } from 'react';

import TextInput from '../../components/TextInput/TextInput';

import classes from './SignUp.module.css';

const SignUp = props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div className={classes.SignUp}>
            <TextInput type="text" placeholder="email" value={email} onChange={event => setEmail(event.target.value)} />
            <TextInput type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
            <TextInput type="password" placeholder="confirm password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
        </div>
    )
}

export default SignUp;