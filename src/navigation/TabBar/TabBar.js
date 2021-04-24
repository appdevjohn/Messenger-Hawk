import TabBarItem from '../../components/TabBarItem/TabBarItem';

import classes from './TabBar.module.css';
import postImg from '../../assets/post.png';
import messageImg from '../../assets/message.png';

const TabBar = props => {
    return (
        <div className={classes.TabBar}>
            <TabBarItem link="/posts" title="Posts" image={postImg} />
            <TabBarItem link="/conversations" title="Convos" image={messageImg} />
        </div>
    )
}

export default TabBar;