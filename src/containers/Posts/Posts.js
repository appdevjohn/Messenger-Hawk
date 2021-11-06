import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import TableView from '../../components/TableView/TableView';
import PostCell from '../../components/PostCell/PostCell';

import classes from './Posts.module.css';
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

    const groupNameClicked = () => {
        console.log('clicked');
    }

    return (
        <div className={classes.Posts}>
            <NavBar
                title={<div className={classes.groupName} onClick={groupNameClicked}>Nintendo Gamers</div>}
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