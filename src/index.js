import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from '@redux-devtools/extension'

import './index.css';
import App from './App';
import { initDatabase } from './localDatabase';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import groupsStore from './store/reducers/groups';
import authStore from './store/reducers/auth';
import errorStore from './store/reducers/error';
import userStore from './store/reducers/user';
import updateStore from './store/reducers/updates';

// Setting up Redux store
const rootReducer = combineReducers({
    groups: groupsStore,
    auth: authStore,
    error: errorStore,
    user: userStore,
    updates: updateStore
});
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

// Initializing IndexedDB database.
initDatabase();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
