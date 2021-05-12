import { useState, useEffect } from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as authActions from '../../store/actions/auth';
import TextInput from '../../components/TextInput/TextInput';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './AuthForm.module.css';

const SignUp = props => {
    const token = useSelector(state => state.auth.token);
    const isLoading = useSelector(state => state.auth.loading);
    const redirectPath = useSelector(state => state.auth.redirectPath);
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmationNum, setConfirmationNum] = useState('');

    const { history } = props;
    useEffect(() => {
        console.log(token);
        if (token) {
            history.push(redirectPath);
        }
    }, [token, history, redirectPath]);

    const onSignUp = () => {
        // mock a call to the server
        dispatch(authActions.setLoading(true));
        setTimeout(() => {
            history.push('/auth/confirm-email');
            dispatch(authActions.setLoading(false));
        }, 1000);
    }

    const onConfirmEmail = () => {
        // mock a call to the server
        dispatch(authActions.setLoading(true));
        setTimeout(() => {
            history.push('/auth/login');
            dispatch(authActions.setLoading(false));
        }, 1000);
    }

    const onLogIn = () => {
        // log in the user
        dispatch(authActions.startLogIn('email@example.com', 'password'));
    }

    return (
        <div className={classes.SignUp}>
            <Route path={['/auth/signup', '/auth/login']}>
                <TextInput type="text" placeholder="email" value={email} onChange={event => setEmail(event.target.value)} />
                <TextInput type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
            </Route>
            <Switch>
                <Route path="/auth/signup">
                    <TextInput type="password" placeholder="confirm password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
                    <SubmitButton title="Sign Up" onClick={onSignUp} />
                    <Link to="/auth/login" className={classes.alternateModeLink}>or Log In</Link>
                </Route>
                <Route path="/auth/login">
                    <SubmitButton title="Log In" onClick={onLogIn} />
                    <Link to="/auth/signup" className={classes.alternateModeLink}>or Sign Up</Link>
                </Route>
                <Route path="/auth/confirm-email">
                    <TextInput type="text" placeholder="Confirmation NUmber" value={confirmationNum} onChange={event => setConfirmationNum(event.target.value)} />
                    <SubmitButton title="Confirm" onClick={onConfirmEmail} />
                </Route>
            </Switch>
            {isLoading ? <LoadingIndicator /> : null}
        </div>
    )
}

export default withRouter(SignUp);