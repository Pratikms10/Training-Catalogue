import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import { installContactActionTracking } from '../../../src/data/trackContactAction';
import { installSeoTelemetry } from '../../../src/data/installSeoTelemetry';
import './index.css';

installContactActionTracking();
installSeoTelemetry();

const root = document.getElementById('root')!;
const application = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (root.hasChildNodes()) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.replaceChildren();
    createRoot(root).render(application);
  }));
} else {
  createRoot(root).render(application);
}
