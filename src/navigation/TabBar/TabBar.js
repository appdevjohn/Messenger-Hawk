import TabBarItem from './TabBarItem/TabBarItem';

import classes from './TabBar.module.css';
import postImg from '../../assets/post.png';
import messageImg from '../../assets/message.png';
import accountImg from '../../assets/account.png';

const TabBar = props => {
    return (
        <div className={classes.TabBar}>
            <TabBarItem link="/posts" title="Posts" image={postImg} />
            <TabBarItem link="/conversations" title="Convos" image={messageImg} />
            <TabBarItem link="/account" title="Account" image={accountImg} />
        </div>
    )
}

export default TabBar;