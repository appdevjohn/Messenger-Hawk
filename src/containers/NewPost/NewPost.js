import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import api from '../../api';
import { setError } from '../../store/actions/error';
import NavBar from '../../navigation/NavBar/NavBar';

import classes from './NewPost.module.css';
import backImg from '../../assets/back.png';

const NewPost = props => {
    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);
    const activeGroup = useSelector(state => state.groups.activeGroup);

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const newPostHandler = () => {
        if (activeGroup) {
            api.post('/posts/new', {
                groupId: activeGroup.id,
                title: title,
                text: text
            }, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                props.history.push(`/posts/${response.data.post.id}`);
            }).catch(error => {
                console.error(error);
                dispatch(setError('Could not create post.', error.response.data.message));
            })
        } else {
            console.error('No active group to post in.')
        }
    }

    return (
        <div className={classes.NewPost}>
            <NavBar title="New Post" leftButton={{ img: backImg, alt: 'Back', to: '/posts' }} />
            <input className={classes.titleInput} name="title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className={classes.textContentInput} name="text" placeholder="Text" value={text} onChange={e => setText(e.target.value)} />
            <div className="SubmitBtnContainer">
                <button className="SubmitBtn" onClick={newPostHandler} disabled={!activeGroup}>Post</button>
            </div>
        </div>
    )
}

export default withRouter(NewPost);