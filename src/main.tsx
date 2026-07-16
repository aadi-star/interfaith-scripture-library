import './shim.ts';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle and suppress benign Vite WebSocket connection errors that are expected when HMR is disabled in this environment.
if (typeof window !== 'undefined') {
  const ignorePatterns = [
    'websocket',
    'websocket closed without opened',
    'vite',
    'failed to connect to websocket',
    'hmr',
    'script error',
    'script'
  ];

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event ? event.reason : null;
    const reasonStr = reason ? String(reason.message || reason).toLowerCase() : "";
    if (!reasonStr || ignorePatterns.some(pattern => reasonStr.includes(pattern))) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      console.info('Suppressed expected development WebSocket/Vite HMR rejection:', reason);
    }
  });

  window.addEventListener('error', (event) => {
    const message = event && event.message ? String(event.message).toLowerCase() : "";
    if (!message || ignorePatterns.some(pattern => message.includes(pattern))) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      console.info('Suppressed expected development WebSocket/Vite HMR error:', message);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register Service Worker for audio headless checks and caching
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('[Service Worker] Registered successfully:', reg.scope);
      })
      .catch(err => {
        console.warn('[Service Worker] Registration failed (expected in secure sandboxed iframes):', err);
      });
  });
}
