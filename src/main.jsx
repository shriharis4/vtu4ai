import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';
import { ToastProvider } from './components/Toast.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ProfileProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ProfileProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
