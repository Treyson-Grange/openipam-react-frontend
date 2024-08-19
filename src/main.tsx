import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const organizationName = import.meta.env.VITE_ORGANIZATION_NAME as string;
document.title = `openIPAM | ${organizationName}`;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
