import { useState } from 'react';
import { useSelector } from 'react-redux';

import api from '../../api';
import NavBar from '../../navigation/NavBar/NavBar';

import classes from './NewPost.module.css';
import backImg from '../../assets/back.png';

const NewPost = props => {
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
                console.log(response.data);
            }).catch(error => {
                console.error(error);
            })
        } else {
            console.error('No active group to post in.')
        }
    }

    return (
        <div className={classes.NewPost}>
            <NavBar title="New Post" leftButton={{ img: backImg, alt: 'Back', to: '/posts' }} />
            <input name="title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <input name="text" placeholder="Text" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={newPostHandler} disabled={!activeGroup}>Post</button>
        </div>
    )
}

export default NewPost;