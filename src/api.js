import axios from 'axios';

import store from './store/store';
import { setError } from './store/actions/error';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

api.interceptors.response.use(response => {
    return response;
}, error => {
    const url = error.response?.config?.url;
    if (url && !url.includes('auth')) {
        store.dispatch(setError('Error', error.response?.data?.message || 'There was an error on the server.'));
    }
    return Promise.reject(error);
});

export default api;