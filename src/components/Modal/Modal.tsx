import React from 'react';
import './modal.css';

export default function Modal ({onClose, children} : {
    onClose: () => void,
    children: React.ReactNode
}) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};