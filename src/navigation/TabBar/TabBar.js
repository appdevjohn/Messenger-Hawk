import TabBarItem from '../../components/TabBarItem/TabBarItem';

import classes from './TabBar.module.css';

const TabBar = props => {
    return (
        <div className={classes.TabBar}>
            <TabBarItem />
            <TabBarItem />
            <TabBarItem />
        </div>
    )
}

export default TabBar;