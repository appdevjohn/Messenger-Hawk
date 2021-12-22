import NavBar from '../../navigation/NavBar/NavBar';

import classes from './JoinGroup.module.css';
import backImg from '../../assets/back.png';
import addImg from '../../assets/add.png';

const JoinGroup = props => {
    return (
        <div className={classes.JoinGroup}>
            <NavBar
                title="Join Group"
                leftButton={{ img: backImg, alt: 'Back', to: '/posts' }}
                rightButton={{ img: addImg, alt: 'Create Group', to: '/new-group' }} />
        </div>
    )
}

export default JoinGroup;