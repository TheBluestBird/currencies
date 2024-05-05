import React from 'react';
import './spinner.css';

interface PrivateProps {
    size?: number;
}
interface Props extends PrivateProps {
    withOverlay?: boolean;
}

export default function Spinner ({ size = 50, withOverlay = false }: Props)  {
    if (!withOverlay)
        return (<PrivateSpinner size={size}/>);

    return (
        <div className="spinner-overlay">
            <PrivateSpinner size={size}/>
        </div>
    );
}

function PrivateSpinner ({ size = 50 }: PrivateProps) {
    return (
        <div role="status"
             className="spinner"
             style={{width: size, height: size}}
        ></div>
    )
}