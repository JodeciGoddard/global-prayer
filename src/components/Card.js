import React, { useState } from 'react';
import '../css/Card.css';
import { motion } from 'framer-motion';

const containerVariants = {
    init: {
        x: '-100vw',
        opacity: 0
    },
    anim: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            type: 'spring',
            stiffness: 90
        }
    },


}

const Card = ({ children, title, bg, overlay, hideShowMore, onClick }) => {

    let backgroundStyle = {
        backgroundImage: `url(${bg})`,
        backgroundColor: `${overlay}`
    }

    return (
        <motion.div
            className="card-container"
            onClick={onClick}
            style={backgroundStyle}
            variants={containerVariants}
        >
            <div className="card-header">
                {title}
            </div>
            {!hideShowMore && <div className="card-show">
                Show More
            </div>}
            {children}
        </motion.div>
    );
}

export default Card;