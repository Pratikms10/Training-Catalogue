import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { installContactActionTracking } from '../../../src/data/trackContactAction';
import './index.css';

installContactActionTracking();

const routerBasename = window.location.pathname === '/' ? '/' : '/website';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
