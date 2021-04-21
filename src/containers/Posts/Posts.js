import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';
import TableView from '../../components/TableView/TableView';
import PostCell from '../../components/PostCell/PostCell';

import classes from './Posts.module.css';

const Posts = props => {
    return (
        <div className={classes.Posts}>
            <NavBar title="Posts" />
            <TableView>
                <PostCell data="Post 1" />
                <PostCell data="Post 2" />
                <PostCell data="Post 3" />
            </TableView>
            <TabBar />
        </div>
    )
}

export default Posts;