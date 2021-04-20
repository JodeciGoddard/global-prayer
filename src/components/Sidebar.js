import React from 'react';
import '../css/Sidebar.css';
import { logUserOut } from '../api/Firebase';
import { useHistory } from 'react-router-dom';

const Sidebar = ({ visible, backClick }) => {

    let history = useHistory();



    return (
        <div className={visible ? "sidebar-container" : "sidebar-container none"} onClick={backClick}>
            <div className="sidebar-bar">
                <p onClick={() => { history.push('/home') }}>Home</p>
                <p>Settings</p>
                <p onClick={logUserOut}>Sign Out</p>
            </div>
        </div>
    );
}

export default Sidebar;