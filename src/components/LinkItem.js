import React from 'react';
import '../css/LinkItem.css'
import { AiFillCopy } from 'react-icons/ai';
import { GiShare } from 'react-icons/gi';
import { systemMessage } from '../State';
import { useSetRecoilState } from 'recoil';

const LinkItems = ({ url, title }) => {

    const message = useSetRecoilState(systemMessage);

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(url);
        message('Link Copied');
    }

    return (
        <div className="link-container">
            <p>{title}</p>
            <a href={url}>zoom link click here</a>
            <AiFillCopy className="link-copy" onClick={copyToClipBoard} />
            <GiShare className="link-share" />
        </div>
    );
}

export default LinkItems;