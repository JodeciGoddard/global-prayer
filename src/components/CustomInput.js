import React from 'react';
import '../css/CustomInput.css';

const CustomInput = ({ readonly, type, label, placeholder, onChange, value, id, labelClass, inputClass, containerClass }) => {
    return (
        <div className={containerClass + " custom-input-container"}>
            <label htmlFor={id} className={labelClass + " custom-label"} >{label}</label>
            <input readOnly={readonly} className={`custom-input ${inputClass}`} id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} />
        </div>

    );
}

export default CustomInput;