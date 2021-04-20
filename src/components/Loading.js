import React from 'react';
import '../css/Loading.css';

const Loading = ({ Loading }) => {
    return (
        <div className={Loading ? "l-container" : "l-container hidden"}>
            <div className="l-balls">
                <svg width="192" height="200" viewBox="0 0 192 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Loader">
                        <circle id="Ball 1" cx="25" cy="100" r="25" />
                        <circle id="Ball 2" cx="50" cy="157" r="25" />
                        <circle id="Ball 3" cx="117" cy="175" r="25" />
                        <circle id="Ball 4" cx="167" cy="132" r="25" />
                        <circle id="Ball 5" cx="167" cy="68" r="25" />
                        <circle id="Ball 6" cx="117" cy="25" r="25" />
                        <circle id="Ball 7" cx="50" cy="43" r="25" />
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default Loading;