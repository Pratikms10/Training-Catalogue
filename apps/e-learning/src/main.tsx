import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import { installContactActionTracking } from '../../../src/data/trackContactAction';
import './index.css';

installContactActionTracking();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
