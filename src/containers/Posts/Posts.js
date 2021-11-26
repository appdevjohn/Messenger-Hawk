import { useState, Fragment } from 'react';

import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import FloatingOptions from '../../components/FloatingOptions/FloatingOptions';
import TableView from '../../components/TableView/TableView';
import PostCell from '../../components/PostCell/PostCell';

import classes from './Posts.module.css';
import splashClasses from '../SplashView.module.css';
import groupImg from '../../assets/group.png';
import addImg from '../../assets/add.png';

const Posts = props => {
    const posts = [
        <PostCell
            key="0"
            imgSrc="https://dummyimage.com/128/f2efea/000000.png"
            name="John Champion"
            time={new Date()}
            title="Does anybody else love the feeling of airports?"
            body="I know that airports are traditionally hated by everyone for the constant rush and anxiety…" />,
        <PostCell
            key="1"
            imgSrc="https://dummyimage.com/128/f2efea/000000.png"
            name="John Champion"
            time={new Date()}
            title="Does anybody else love the feeling of airports?"
            body="I know that airports are traditionally hated by everyone for the constant rush and anxiety…" />,
        <PostCell
            key="2"
            imgSrc="https://dummyimage.com/128/f2efea/000000.png"
            name="John Champion"
            time={new Date()}
            title="Does anybody else love the feeling of airports?"
            body="I know that airports are traditionally hated by everyone for the constant rush and anxiety…" />
    ]

    const [showGroups, setShowGroups] = useState(false);

    const navBarTitle = (
        <Fragment>
            <div
                className={showGroups ? [classes.groupName, classes.groupNameActive].join(' ') : classes.groupName}
                onClick={() => setShowGroups(show => !show)}>
                Nintendo Gamers
            </div>
            {showGroups ?
                <FloatingOptions
                    style={{ top: '100%' }}
                    onDismiss={() => setShowGroups(false)}
                    options={[{ title: 'Group 1', onClick: () => { } }, { title: 'Group 2', onClick: () => { } }]} />
                : null}
        </Fragment>
    )

    if (posts.length === 0) {
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

    return (
        <div className={classes.Posts}>
            <NavBar
                title={navBarTitle}
                leftButton={{ img: groupImg, alt: 'Groups', to: '/add-group' }}
                rightButton={{ img: addImg, alt: 'New Post', to: '/new-post' }} />
            <TableView>
                {posts}
            </TableView>
            <TabBar />
        </div>
    )
}

export default Posts;