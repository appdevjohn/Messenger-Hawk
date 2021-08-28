import { useEffect } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import api from '../../api';
import * as authActions from '../../store/actions/auth';
import LogIn from './Forms/LogIn';
import SignUp from './Forms/SignUp';
import VerifyEmail from './Forms/VerifyEmail';
import RequestNewPassword from './Forms/RequestNewPassword';
import ResetPassword from './Forms/ResetPassword';

import classes from './AuthForm.module.css';
import hawkImg from '../../assets/hawk.svg';
import hawkWhiteImg from '../../assets/hawk-white.svg';

const AuthForm = props => {
    const token = useSelector(state => state.auth.token);
    const activated = useSelector(state => state.auth.activated);
    const isLoading = useSelector(state => state.auth.loading);
    const authMessage = useSelector(state => state.auth.message);
    const redirectPath = useSelector(state => state.auth.redirectPath);
    const dispatch = useDispatch();

    const { history } = props;
    const { pathname } = history.location;

    useEffect(() => {
        if (token && activated) {
            history.replace(redirectPath);
        } else if (token && !activated) {
            history.replace('/auth/confirm-email');
        } else if (!token && !activated) {
            if (!pathname.includes('/auth/') || pathname === '/auth/confirm-email') {
                history.replace('/auth/login');
            }
        }
    }, [token, activated, history, pathname, redirectPath]);

    useEffect(() => {
        if (pathname === '/auth/logout') {
            dispatch(authActions.startLogOut());
        }
        dispatch(authActions.clearMessage());
    }, [pathname, dispatch])

    const onSignUp = (firstName, lastName, email, username, password, confirmPassword) => {
        dispatch(authActions.startSignUp(firstName, lastName, email, username, password, confirmPassword));
    }

    const onLogIn = (email, password) => {
        dispatch(authActions.startLogIn(email, password));
    }

    const onConfirmEmail = (confirmationNum) => {
        dispatch(authActions.startConfirmEmail(token, confirmationNum));
    }

    const onReConfirmEmail = () => {
        api.put('/auth/resend-verification-code', null, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            dispatch(authActions.setMessage(response.data.message || 'A new verification code has been sent.'));
        }).catch(error => {
            dispatch(authActions.setMessage(error.response?.data?.message || 'There was an error sending a new verification code.'));
        });
    }

    const onRequestNewPassword = (email) => {
        dispatch(authActions.setLoading(true));
        api.put('/auth/request-new-password', {
            email: email
        }).then(response => {
            dispatch(authActions.setLoading(false));
            dispatch(authActions.setMessage(response.data.message || 'A password reset email has been sent.'));
        }).catch(error => {
            dispatch(authActions.setLoading(false));
            dispatch(authActions.setMessage(error.response?.data?.message || 'There was a server error processing your request.'));
        });
    }

    const onResetPassword = (resetPasswordToken, password, confirmPassword) => {
        if (password !== confirmPassword) {
            dispatch(authActions.setMessage('Passwords do not match.'));

        } else {
            dispatch(authActions.setLoading(true));
            api.put('/auth/reset-password', {
                resetPasswordToken: resetPasswordToken,
                newPassword: password
            }).then(response => {
                props.history.replace('/auth/login');
                dispatch(authActions.setLoading(false));
                dispatch(authActions.setMessage(response.data.message || 'Your password has been reset.'));
            }).catch(error => {
                dispatch(authActions.setLoading(false));
                dispatch(authActions.setMessage(error.response?.data?.message || 'There was a problem resetting your password.'));
            });
        }
    }

    return (
        <div className={classes.SignUp}>
            <img className={[classes.logo, classes.lightModeOnly].join(' ')} src={hawkImg} alt="Logo" />
            <img className={[classes.logo, classes.darkModeOnly].join(' ')} src={hawkWhiteImg} alt="Logo" />
            <Switch>
                <Route path="/auth/signup" exact>
                    <SignUp onSubmit={onSignUp} authMessage={authMessage} isLoading={isLoading} />
                </Route>
                <Route path="/auth/login" exact>
                    <LogIn onSubmit={onLogIn} authMessage={authMessage} isLoading={isLoading} />
                </Route>
                <Route path="/auth/confirm-email" exact>
                    <VerifyEmail onSubmit={onConfirmEmail} onResendCode={onReConfirmEmail} onLogOut={() => dispatch(authActions.startLogOut())} authMessage={authMessage} isLoading={isLoading} />
                </Route>
                <Route path="/auth/request-new-password">
                    <RequestNewPassword onSubmit={onRequestNewPassword} authMessage={authMessage} isLoading={isLoading} />
                </Route>
                <Route path="/auth/reset-password/:resetPasswordToken">
                    <ResetPassword onSubmit={onResetPassword} authMessage={authMessage} isLoading={isLoading} />
                </Route>
                <Route>
                    <Redirect to="/auth/login" />
                </Route>
            </Switch>
        </div>
    )
}

export default withRouter(AuthForm);