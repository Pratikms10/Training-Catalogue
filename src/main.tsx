import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import { installContactActionTracking } from './data/trackContactAction';
import { installSeoTelemetry } from './data/installSeoTelemetry';
import './index.css';

installContactActionTracking();
installSeoTelemetry();

const root = document.getElementById('root')!;
const initialDataElement = document.getElementById('__TECHNOEDGE_INITIAL_DATA__');
const initialData = initialDataElement?.textContent
  ? JSON.parse(initialDataElement.textContent)
  : undefined;
const application = (
  <StrictMode>
    <BrowserRouter>
      <App initialData={initialData} />
    </BrowserRouter>
  </StrictMode>
);

if (root.hasChildNodes()) {
  // The prerendered document reaches first paint and crawlers immediately.
  // Replace it on the next frame with the interactive application. React 19
  // resource hint hoisting can make a full-root hydration tree differ after
  // browser parsing, so client mounting is the reliable progressive-enhance path.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.replaceChildren();
    createRoot(root).render(application);
  }));
} else {
  createRoot(root).render(application);
}
