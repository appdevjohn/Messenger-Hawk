import { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import api from '../../api';
import * as localDB from '../../localDatabase';
import * as groupsActions from '../../store/actions/groups';
import { setError } from '../../store/actions/error';
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

const postsPerQuery = 20;

const getPosts = async (token, groupId, offset = 0) => {
    if (token && groupId) {
        const response = await api.get(`/posts?groupId=${groupId}&limit=${postsPerQuery}&offset=${offset}`, {
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

const Posts = props => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const groups = useSelector(state => state.groups.groups);
    const activeGroup = useSelector(state => state.groups.activeGroup);
    const groupsLoading = useSelector(state => state.groups.loading);

    const [showGroups, setShowGroups] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!activeGroup) { return }
            setIsLoading(true);

            try {
                const localPosts = await localDB.getPostsFromGroup(activeGroup.id);
                setPosts(localPosts);

                const serverPosts = await getPosts(token, activeGroup.id);
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
    }, [setPosts, dispatch, activeGroup, token])

    const loadMorePosts = async () => {
        if (!activeGroup) { return }
        setIsLoading(true);

        const newPosts = await getPosts(token, activeGroup.id, posts.length);
        setIsLoading(false);

        if (newPosts.length > 0) {
            setPosts(oldPosts => {
                const newSet = oldPosts.map(post => ({ ...post })).concat(newPosts);

                // Remove duplicates
                const keys = {};
                for (let index = newSet.length - 1; index >= 0; index -= 1) {
                    const post = newSet[index];
                    if (keys[post.id]) {
                        newSet.splice(index, 1);
                    } else {
                        keys[post.id] = true;
                    }
                }

                return newSet;
            })
        } else {
            dispatch(setError('Up to Date', 'There are no older posts to load.'));
        }
    }

    const activeGroupIndex = groups.findIndex(g => g.id === activeGroup?.id);

    const navBarTitle = (
        <Fragment>
            <div
                className={showGroups ? [classes.groupName, classes.groupNameActive].join(' ') : classes.groupName}
                onClick={() => setShowGroups(show => !show)}>
                {activeGroupIndex >= 0 ? groups[activeGroupIndex].name : 'No Group Selected'}
            </div>
            {showGroups ?
                <FloatingOptions
                    style={{ top: '100%' }}
                    onDismiss={() => setShowGroups(false)}
                    options={[
                        ...groups.map(g => ({ title: g.name, onClick: () => { dispatch(groupsActions.setActiveGroupId(g.id)); setShowGroups(false); } })),
                        { title: 'Join Group', onClick: () => props.history.push('/join-group') },
                        { title: 'Create Group', onClick: () => props.history.push('/new-group') },
                    ]} />
                : null}
        </Fragment>
    );

    let viewBody = null;
    if (groups.length === 0 && groupsLoading) {
        viewBody = <LoadingIndicator />
    } else if (groups.length === 0 && !groupsLoading) {
        viewBody = <div className={splashClasses.SplashViewMessage}>No Groups. Why not create one?</div>
    } else if (posts.length > 0 && isLoading) {
        viewBody = (
            <Fragment>
                {posts.map(p => <PostCell
                    key={p.id}
                    postId={p.id}
                    imgSrc={p.userData.profilePicURL}
                    name={p.userData.firstName}
                    time={new Date(p.createdAt)}
                    title={p.title}
                    body={p.text} />)}
                <div className={classes.btnContainer}><button className="Button" onClick={loadMorePosts}>Load More</button></div>
                <LoadingIndicator />
            </Fragment>
        )
    } else if (posts.length > 0 && !isLoading) {
        viewBody = (
            <Fragment>
                {posts.map(p => <PostCell
                    key={p.id}
                    postId={p.id}
                    imgSrc={p.userData.profilePicURL}
                    name={p.userData.firstName}
                    time={new Date(p.createdAt)}
                    title={p.title}
                    body={p.text} />)}
                <div className={classes.btnContainer}><button className="Button" onClick={loadMorePosts}>Load More</button></div>
            </Fragment>
        )
    } else if (posts.length === 0 && isLoading) {
        viewBody = <LoadingIndicator />
    } else {
        viewBody = <div className={splashClasses.SplashViewMessage}>No Posts. Why not create one?</div>
    }

    return (
        <div className={(posts.length === 0 && !isLoading > 0) || (groups.length === 0 && !isLoading) ? splashClasses.SplashView : classes.Posts}>
            <NavBar
                title={navBarTitle}
                leftButton={activeGroup ? { img: groupImg, alt: 'Groups', to: `/groups/${activeGroup?.id}` } : null}
                rightButton={groups.length > 0 ? { img: addImg, alt: 'New Post', to: '/new-post' } : null} />
            <TableView>
                {viewBody}
                <div style={{ height: '48px' }}>{/* Spacing for below the tab bar. */}</div>
            </TableView>
            <TabBar />
        </div>
    )
}

export default withRouter(Posts);