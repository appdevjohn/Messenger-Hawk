import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import api from '../../api';
import NavBar from '../../navigation/NavBar/NavBar';
import GroupCell from './GroupCell/GroupCell';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './JoinGroup.module.css';
import backImg from '../../assets/back.png';

const JoinGroup = props => {
    const token = useSelector(state => state.auth.token);

    const [groupResults, setGroupResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchQuery.length >= 3 && token) {

            const axiosController = new AbortController();

            const timeout = setTimeout(() => {
                setIsLoading(true);

                api.get(`/groups/search/${searchQuery}`, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'Content-Type': 'application/json',
                        signal: axiosController.signal
                    }
                }).then(response => {
                    setGroupResults(response.data.groups);
                    setIsLoading(false);
                }).catch(error => {
                    console.error(error);
                    setIsLoading(false);
                });
            }, 500);

            return () => {
                clearTimeout(timeout);
                axiosController.abort();
                setIsLoading(false);
            }
        } else {
            setGroupResults([]);
        }
    }, [searchQuery, token]);

    return (
        <div className={classes.JoinGroup}>
            <NavBar
                title="Join Group"
                leftButton={{ img: backImg, alt: 'Back', onClick: props.history.goBack }} />
            <input className={['ListSearchInput', classes.search].join(' ')} placeholder="Search Groups" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <div>{groupResults.map(gr => <GroupCell name={gr.name} description={gr.description} id={gr.id} key={gr.id} />)}</div>
            {isLoading ? <LoadingIndicator /> : null}
        </div>
    )
}

export default withRouter(JoinGroup);