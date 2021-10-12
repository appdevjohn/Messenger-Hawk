import { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import FormBox from '../FormBox/FormBox';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';

import formsClasses from '../Forms/Forms.module.css';

const VerifyEmail = props => {
    const [activateToken, setActivateToken] = useState('');

    const submitHandler = () => {
        props.onSubmit(activateToken);
    }

    return (
        <Fragment>
            <FormBox title="Verify Email" message="An activation code was emailed to you.">
                <div className={formsClasses.inputs}>
                    <input
                        className={formsClasses.Input}
                        type="text"
                        placeholder="activation code"
                        value={activateToken}
                        onChange={e => setActivateToken(e.target.value)} />
                </div>
                {props.isLoading ? <LoadingIndicator /> : <div className={formsClasses.authMessage}>{props.authMessage}</div>}
                <button className={['Button', formsClasses.Button].join(' ')} onClick={submitHandler}>Activate Account</button>
            </FormBox>
            <div className={formsClasses.otherOptions}>
                <button
                    className={['Button', 'UnemphasizedBtn'].join(' ')}
                    onClick={props.onResendCode}>
                    Resend Code
                </button>
                <button
                    className={['Button', 'UnemphasizedBtn'].join(' ')}
                    onClick={props.onLogOut}>
                    Back
                </button>
            </div>
        </Fragment>
    )
}

VerifyEmail.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onResendCode: PropTypes.func.isRequired,
    onLogOut: PropTypes.func.isRequired,
    authMessage: PropTypes.string,
    isLoading: PropTypes.bool
}

export default VerifyEmail;