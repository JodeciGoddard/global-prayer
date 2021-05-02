import React, { useState } from 'react';
import '../css/BibleReadings.css'
import Navbar from '../components/Navbar';
import BibleImage from '../images/bible.jpg';

const BibleReadings = () => {

    let backgroundStyle = {
        backgroundImage: `url(${BibleImage})`
    }

    return (
        <div className="bible-container" style={backgroundStyle}>
            <Navbar />
            <div className="bible-wrapper" >


            </div>

        </div>
    );
}

export default BibleReadings;