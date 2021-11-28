import { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import api from '../../api';
import * as localDB from '../../localDatabase';
import * as activeGroupActions from '../../store/actions/activeGroup';
import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import FloatingOptions from '../../components/FloatingOptions/FloatingOptions';
import TableView from '../../components/TableView/TableView';
import PostCell from '../../components/PostCell/PostCell';

import classes from './Posts.module.css';
import splashClasses from '../SplashView.module.css';
import groupImg from '../../assets/group.png';
import addImg from '../../assets/add.png';

const Posts = props => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const activeGroupId = useSelector(state => state.activeGroupId);

    const [showGroups, setShowGroups] = useState(false);
    const [groups, setGroups] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getGroups = async () => {
            if (token) {
                const response = await api.get('/groups', {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'Conotent-Type': 'application/json'
                    }
                });

                return response.data.groups;
            } else {
                return null;
            }
        }

        const getPosts = async (groupId) => {
            if (token && groupId) {
                const response = await api.get(`/posts?groupId=${groupId}`, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'Conotent-Type': 'application/json'
                    }
                });

                return response.data.posts;
            } else {
                return null;
            }
        }

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const localGroups = await localDB.getGroups();
                setGroups(localGroups);

                const groupId = await localDB.getLastViewedGroupId();
                let newActiveGroupId = null;
                if (groupId) {
                    newActiveGroupId = groupId;
                } else if (localGroups.length > 0) {
                    newActiveGroupId = localGroups[0].id;
                    localDB.setLastViewedGroupId(newActiveGroupId);
                };
                dispatch(activeGroupActions.setActiveGroup(newActiveGroupId));

                const localPosts = await localDB.getPostsFromGroup(newActiveGroupId);
                setPosts(localPosts);

                const serverGroups = await getGroups();
                if (serverGroups) {
                    console.log(serverGroups);
                    localDB.deleteAllGroups();
                    serverGroups.forEach(g => {
                        localDB.addGroup(g);
                    });
                    setGroups(serverGroups);

                    if (serverGroups.length > 0 && serverGroups.findIndex(g => g.id === newActiveGroupId) < 0) {
                        localDB.setLastViewedGroupId(serverGroups[0].id);
                        dispatch(activeGroupActions.setActiveGroup(serverGroups[0].id));
                    } else if (serverGroups.length === 0) {
                        localDB.deleteLastViewedGroupId();
                        dispatch(activeGroupActions.setActiveGroup(null));
                    }
                }

                const serverPosts = await getPosts();
                if (serverPosts) {
                    localDB.deleteAllPosts();
                    serverPosts.forEach(p => {
                        localDB.addPost(p);
                    });
                    setPosts(serverPosts);
                }

                setIsLoading(false);

            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        }

        fetchData();
    }, [setGroups, setPosts, dispatch, token])

    const activeGroupIndex = groups.findIndex(g => g.id === activeGroupId);

    const navBarTitle = activeGroupIndex >= 0 ? (
        <Fragment>
            <div
                className={showGroups ? [classes.groupName, classes.groupNameActive].join(' ') : classes.groupName}
                onClick={() => setShowGroups(show => !show)}>
                {groups[activeGroupIndex].name}
            </div>
            {showGroups ?
                <FloatingOptions
                    style={{ top: '100%' }}
                    onDismiss={() => setShowGroups(false)}
                    options={groups.map(g => ({ title: g.name, onClick: () => { } }))} />
                : null}
        </Fragment>
    ) : 'No Group Selected';

    if (groups.length === 0) {
        return (
            <div className={splashClasses.SplashView}>
                <NavBar
                    title="Groups"
                    leftButton={{ img: groupImg, alt: 'Groups', to: '/add-group' }} />
                <div className={splashClasses.SplashViewMessage}>No Groups. Why not create one?</div>
                <TabBar />
            </div>
        )
    }

    let viewBody = null;
    if (groups.length === 0 && isLoading) {
        viewBody = <LoadingIndicator />
    } else if (groups.length === 0 && !isLoading) {
        viewBody = <div className={splashClasses.SplashViewMessage}>No Groups. Why not create one?</div>
    } else if (posts.length > 0 && isLoading) {
        viewBody = (
            <Fragment>
                {posts.map(p => <PostCell key={p.id} imgSrc={p.imgSrc} name={p.name} time={p.time} title={p.title} body={p.body} />)}
                <LoadingIndicator />
            </Fragment>
        )
    } else if (posts.length > 0 && !isLoading) {
        viewBody = posts.map(p => <PostCell key={p.id} imgSrc={p.imgSrc} name={p.name} time={p.time} title={p.title} body={p.body} />);
    } else if (posts.length === 0 && isLoading) {
        viewBody = <LoadingIndicator />
    } else {
        viewBody = <div className={splashClasses.SplashViewMessage}>No Posts. Why not create one?</div>
    }

    return (
        <div className={(posts.length === 0 && !isLoading > 0) || (groups.length === 0 && !isLoading) ? splashClasses.SplashView : classes.Posts}>
            <NavBar
                title={navBarTitle}
                leftButton={{ img: groupImg, alt: 'Groups', to: '/add-group' }}
                rightButton={groups.length > 0 ? { img: addImg, alt: 'New Post', to: '/new-post' } : null} />
            <TableView>
                {viewBody}
            </TableView>
            <TabBar />
        </div>
    )
}

export default Posts;