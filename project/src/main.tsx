import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App.tsx';
import './index.css';
import awsConfig from './aws-config';

// Configure AWS Amplify
Amplify.configure(awsConfig);

// Register service worker for offline capabilities  --> Disabled as not supported in stackblitz
if ('serviceWorker' in navigator && !window.location.hostname.includes('stackblitz.io')) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
} else {
  console.warn('Service Workers are disabled in StackBlitz.');
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);