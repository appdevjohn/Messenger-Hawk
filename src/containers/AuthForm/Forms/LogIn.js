import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FormBox from '../FormBox/FormBox';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';

import sharedClasses from '../../../shared.module.css';
import formsClasses from '../Forms/Forms.module.css';

const LogIn = props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = () => {
        props.onSubmit(email, password)
    }

    return (
        <Fragment>
            <FormBox title="Log In">
                <div className={formsClasses.inputs}>
                    <input
                        className={[sharedClasses.Input, formsClasses.Input].join(' ')}
                        type="email" placeholder="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                    <input
                        className={[sharedClasses.Input, formsClasses.Input].join(' ')}
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} />
                </div>
                {props.isLoading ? <LoadingIndicator /> : <div className={formsClasses.authMessage}>{props.authMessage}</div>}
                <button className={[sharedClasses.Button, formsClasses.Button].join(' ')} onClick={submitHandler}>Log In</button>
            </FormBox>
            <Link className={[sharedClasses.Button, sharedClasses.UnemphasizedBtn].join(' ')} to="/auth/signup">Sign Up</Link>
            <Link className={[sharedClasses.Button, sharedClasses.UnemphasizedBtn].join(' ')} to="/auth/request-new-password">Forgot Password</Link>
        </Fragment>
    )
}

LogIn.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    authMessage: PropTypes.string,
    isLoading: PropTypes.bool
}

export default LogIn;