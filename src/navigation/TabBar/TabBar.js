import TabBarItem from '../../components/TabBarItem/TabBarItem';

import classes from './TabBar.module.css';

const TabBar = props => {
    return (
        <div className={classes.TabBar}>
            <TabBarItem link="/posts" title="Posts" />
            <TabBarItem link="/conversations" title="Convos" />
        </div>
    )
}

export default TabBar;