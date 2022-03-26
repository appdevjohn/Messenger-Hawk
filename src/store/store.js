import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension'

import groupsStore from './reducers/groups';
import authStore from './reducers/auth';
import errorStore from './reducers/error';
import userStore from './reducers/user';
import updateStore from './reducers/updates';

// Setting up Redux store
const rootReducer = combineReducers({
    groups: groupsStore,
    auth: authStore,
    error: errorStore,
    user: userStore,
    updates: updateStore
});
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;