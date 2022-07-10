import React from 'react';
import ReactDOM from 'react-dom/client';
import 'normalize.css'
import './index.css'
import App from './App';
import { AppProvider } from './context/appContext'; //set up global context to the root most component 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>

);
