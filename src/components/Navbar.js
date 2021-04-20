import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import '../css/Navbar.css';
import { userToken, userProfile } from '../State';
import { useRecoilState } from 'recoil';
import { FiMenu } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import staticImage from '../images/img-person-placeholder.jpg';

const Navbar = () => {

    const [user, setUser] = useRecoilState(userToken);
    const [profile, setProfile] = useRecoilState(userProfile);
    const [sidebar, setSidebar] = useState(false);



    const location = useLocation();
    const history = useHistory();

    let imageStyle = {
        backgroundImage: `url(${profile.profileImage ? profile.profileImage : staticImage})`,
        backgroundColor: 'grey',
    }

    const toggleSidebar = () => {
        setSidebar(!sidebar);
    }

    useEffect(() => {
        if (user === 'none') {
            history.push('/');
        }
    }, []);

    let path = location.pathname;

    path = path.replace("/", "");
    path = path.charAt(0).toUpperCase() + path.slice(1);

    if (path.split("/").length > 1) {
        path = path.split("/")[0];
    }

    return (

        <div className={user !== 'none' ? "nav-container" : "nav-container hide"}>
            <FiMenu className="nav-item footer" onClick={toggleSidebar} />
            <p className="nav-item header">{path}</p>

            {/* <img src={profile && profile.profileImage ? profile.profileImage : staticImage} /> */}

            <div className="nav-pic-container">
                <div className="nav-profile-pic" style={imageStyle}>
                </div>
            </div>

            <Sidebar visible={sidebar} backClick={toggleSidebar} />
        </div>

    );
}

export default Navbar;