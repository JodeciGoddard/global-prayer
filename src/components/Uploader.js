import React, { useState } from 'react';
import '../css/Uploader.css';
import { getStorageRef } from '../api/Firebase';

const Uploader = ({ id, label, onImageSet }) => {

    const [image, setImage] = useState(null);
    const [filename, setFilename] = useState('No file selected');
    const [url, setUrl] = useState();
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const fileChoosen = (image) => {
        onImageSet(image);
    }


    const handleChange = e => {
        setError('');

        if (e.target.files[0]) {

            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
            if (!validImageTypes.includes(e.target.files[0].type)) {
                setError('Please use valid image type .jpeg, .png');
                return;
            }
            setFilename(e.target.files[0].name);
            fileChoosen(e.target.files[0]);
        }

    }

    const handleUpload = () => {

    }

    return (
        <div className="uploader-container">
            <label htmlFor={id} className="uploader-label" >
                <p>{label}</p>
                <div className="uploader-output">{filename}</div>
                <div className="uploader-progress" style={{ width: `${progress}%` }}></div>
                {error &&
                    <p className="uploader-error">{error}</p>}
            </label>
            <input className="uploader-input" id={id} type="file" onChange={handleChange} />
            {/* <CustomButton onClick={handleUpload} className="upload-button">Upload</CustomButton> */}
        </div>
    );
}

export default Uploader;