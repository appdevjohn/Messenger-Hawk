import NavBar from '../../navigation/NavBar/NavBar';
import TabBar from '../../navigation/TabBar/TabBar';

import classes from './AddGroup.module.css';
import backImg from '../../assets/back.png';
import addImg from '../../assets/add.png';

const AddGroup = props => {
    return (
        <div className={classes.Groups}>
            <NavBar
                title="Add Group"
                leftButton={{ img: backImg, alt: 'Back', to: '/posts' }}
                rightButton={{ img: addImg, alt: 'Create Group', to: '/new-group' }} />
            <TabBar />
        </div>
    )
}

export default AddGroup;