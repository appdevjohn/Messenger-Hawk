import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FormBox from '../FormBox/FormBox';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';

import formsClasses from '../Forms/Forms.module.css';

const SignUp = props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');

    const submitHandler = () => {
        props.onSubmit(firstName, lastName, email, username, password, confirmPassword);
    }

    return (
        <Fragment>
            <FormBox title="Sign Up">
                <div className={formsClasses.inputs}>
                    <input
                        className={formsClasses.Input}
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                    <input
                        className={formsClasses.Input}
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} />
                    <input
                        className={formsClasses.Input}
                        type="password"
                        placeholder="confirm password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} />
                    <input
                        className={formsClasses.Input}
                        type="text"
                        placeholder="first name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)} />
                    <input
                        className={formsClasses.Input}
                        type="text"
                        placeholder="last name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)} />
                    <input
                        className={formsClasses.Input}
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)} />
                </div>
                {props.isLoading ? <LoadingIndicator /> : <div className={formsClasses.authMessage}>{props.authMessage}</div>}
                <button className={['Button', formsClasses.Button].join(' ')} onClick={submitHandler}>Sign Up</button>
            </FormBox>
            <div className={formsClasses.otherOptions}>
                <Link className={['Button', 'UnemphasizedBtn'].join(' ')} to="/auth/login">Log In</Link>
                <Link className={['Button', 'UnemphasizedBtn'].join(' ')} to="/auth/request-new-password">Forgot Password</Link>
            </div>
        </Fragment>
    )
}

SignUp.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    authMessage: PropTypes.string,
    isLoading: PropTypes.bool
}

export default SignUp;