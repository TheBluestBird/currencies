import React from 'react';
import './spinner.css';

export default function Spinner ({ size = 50, withOverlay = false }: {
    size?: number,
    withOverlay?: boolean
})  {
    if (withOverlay)
        return (
            <div className="spinner-overlay">
                <div
                    className="spinner"
                    style={{width: size, height: size}}
                ></div>
            </div>
        );
    else
        return (
            <div
                className="spinner"
                style={{width: size, height: size}}
            ></div>
        );
}