import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const revealLoadingScreen = () => {
  if (!document.querySelector('.loading-screen')) {
    requestAnimationFrame(revealLoadingScreen);
    return;
  }
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('is-booting');
    document.getElementById('boot-shield')?.remove();
  });
};

requestAnimationFrame(revealLoadingScreen);
