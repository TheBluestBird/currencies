import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import {AuthProvider} from "./context/Auth";
import {CurrencyProvider} from "./context/Currencies";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    // <React.StrictMode>
        <AuthProvider>
            <CurrencyProvider>
                <App />
            </CurrencyProvider>
        </AuthProvider>
    // </React.StrictMode>
);
