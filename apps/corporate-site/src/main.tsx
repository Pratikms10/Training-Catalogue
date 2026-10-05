import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { installContactActionTracking } from '../../../src/data/trackContactAction';
import './index.css';

installContactActionTracking();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/website">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
