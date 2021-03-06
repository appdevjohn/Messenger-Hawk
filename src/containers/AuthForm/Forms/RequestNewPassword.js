import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FormBox from '../FormBox/FormBox';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';

import formsClasses from '../Forms/Forms.module.css';

const RequestNewPassword = props => {
    const [email, setEmail] = useState('');

    const submitHandler = () => {
        props.onSubmit(email);
    }

    return (
        <Fragment>
            <FormBox title="Forgot Password" message="You'll be emailed a password reset link.">
                <div className={formsClasses.inputs}>
                    <input
                        className={formsClasses.Input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>
                {props.isLoading ? <LoadingIndicator /> : <div className={formsClasses.authMessage}>{props.authMessage}</div>}
                <button className={['Button', formsClasses.Button].join(' ')} onClick={submitHandler}>Request New Password</button>
            </FormBox>
            <div className={formsClasses.otherOptions}>
                <Link className={['Button', 'UnemphasizedBtn'].join(' ')} to="/auth/login">Log In</Link>
                <Link className={['Button', 'UnemphasizedBtn'].join(' ')} to="/auth/signup">Sign Up</Link>
            </div>
        </Fragment>
    )
}

RequestNewPassword.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    authMessage: PropTypes.string,
    isLoading: PropTypes.bool
}

export default RequestNewPassword;