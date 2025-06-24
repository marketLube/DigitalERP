import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './index.css';
import { TenantProvider } from './contexts/TenantContext';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <TenantProvider>
        <App />
      </TenantProvider>
    </Provider>
  </StrictMode>
);
