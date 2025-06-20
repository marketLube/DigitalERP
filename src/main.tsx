import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TenantProvider } from './contexts/TenantContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TenantProvider>
      <App />
    </TenantProvider>
  </StrictMode>
);
