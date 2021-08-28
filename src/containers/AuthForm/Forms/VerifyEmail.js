import { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import FormBox from '../FormBox/FormBox';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';

import sharedClasses from '../../../shared.module.css';
import formsClasses from '../Forms/Forms.module.css';

const VerifyEmail = props => {
    const [activateToken, setActivateToken] = useState('');

    const submitHandler = () => {
        props.onSubmit(activateToken);
    }

    return (
        <Fragment>
            <FormBox title="Verify Email">
                <div className={formsClasses.inputs}>
                    <input
                        className={[sharedClasses.Input, formsClasses.Input].join(' ')}
                        type="text"
                        placeholder="activation code"
                        value={activateToken}
                        onChange={e => setActivateToken(e.target.value)} />
                </div>
                {props.isLoading ? <LoadingIndicator /> : <div className={formsClasses.authMessage}>{props.authMessage}</div>}
                <button className={[sharedClasses.Button, formsClasses.Button].join(' ')} onClick={submitHandler}>Activate Account</button>
            </FormBox>
            <button
                className={[sharedClasses.Button, sharedClasses.UnemphasizedBtn].join(' ')}
                onClick={props.onResendCode}>
                Resend Code
            </button>
            <button
                className={[sharedClasses.Button, sharedClasses.UnemphasizedBtn].join(' ')}
                onClick={props.onLogOut}>
                Back
            </button>
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