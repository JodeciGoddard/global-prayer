import React, { useState } from 'react';
import '../css/Card.css';

const Card = ({ children, title, bg, overlay }) => {

    let backgroundStyle = {
        backgroundImage: `url(${bg})`,
        backgroundColor: `${overlay}`
    }

    return (
        <div className="card-container" style={backgroundStyle}>
            <div className="card-header">
                {title}
            </div>
            <div className="card-show">
                Show More
            </div>
            {children}
        </div>
    );
}

export default Card;