import React from 'react';
import './spinner.css';

export default function Spinner ({size = 50}: {
    size?: number
})  {
    return (
        <div
            className="spinner"
            style={{width: size, height: size}}
        ></div>
    );
}