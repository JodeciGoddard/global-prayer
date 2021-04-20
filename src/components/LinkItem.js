import React from 'react';
import '../css/LinkItem.css'
import { AiFillCopy } from 'react-icons/ai';
import { GiShare } from 'react-icons/gi';

const LinkItems = ({ url, title }) => {
    return (
        <div className="link-container">
            <p>{title}</p>
            <a href={url}>zoom link click here</a>
            <AiFillCopy className="link-copy" />
            <GiShare className="link-share" />
        </div>
    );
}

export default LinkItems;