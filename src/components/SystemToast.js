import React, { useState, useEffect } from 'react';
import '../css/SystemToast.css';
import { systemMessage } from '../State';
import { useRecoilState } from 'recoil';

const SystemToast = () => {

    const [msg, setMsg] = useRecoilState(systemMessage);
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        if (msg !== "") {
            setHidden(false);
            fade(1500);
        }
    }, [msg]);

    const clearToast = () => {
        setMsg("");
    }

    const fade = (len) => {
        let timer = setTimeout(() => {
            setHidden(true);
            let timer2 = setTimeout(() => {
                setMsg("");
            }, 500);
        }, len);
    }



    return (
        <div className={hidden ? "toast-container hidden" : "toast-container"}>
            <div className="toast-header">
                <p className="toast-close" onClick={clearToast}>x</p>
                <p>System Message:</p>
            </div>
            <div className="toast-main">
                {msg}
            </div>
        </div>
    );
}

export default SystemToast;