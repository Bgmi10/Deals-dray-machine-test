import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {  ToggleProvider } from './context/ToggleContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ToggleProvider>
    <App />
  </ToggleProvider>
  
);

reportWebVitals();
