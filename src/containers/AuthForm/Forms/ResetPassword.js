import { useState, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FormBox from '../FormBox/FormBox';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';

import formsClasses from '../Forms/Forms.module.css';

const ResetPassword = props => {
    const resetPasswordToken = props.match.params.resetPasswordToken;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitHandler = () => {
        props.onSubmit(resetPasswordToken, password, confirmPassword);
    }

    return (
        <Fragment>
            <FormBox title="Reset Password">
                <div className={formsClasses.inputs}>
                    <input
                        className={formsClasses.Input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} />
                    <input
                        className={formsClasses.Input}
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                {props.isLoading ? <LoadingIndicator /> : <div className={formsClasses.authMessage}>{props.authMessage}</div>}
                <button className={['Button', formsClasses.Button].join(' ')} onClick={submitHandler}>Reset</button>
            </FormBox>
            <div className={formsClasses.otherOptions}>
                <Link className={['Button', 'UnemphasizedBtn'].join(' ')} to="/auth/request-new-password">Didn't Get Link</Link>
                <Link className={['Button', 'UnemphasizedBtn'].join(' ')} to="/auth/login">Log In</Link>
            </div>
        </Fragment>
    )
}

ResetPassword.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    authMessage: PropTypes.string,
    isLoading: PropTypes.bool
}

export default withRouter(ResetPassword);