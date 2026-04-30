import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';

const rootElement = document.getElementById('root')!;

// Hydrate if the root already has content (SSG), otherwise render
if (rootElement.children.length > 0) {
  ReactDOM.hydrateRoot(rootElement, <App />);
} else {
  ReactDOM.createRoot(rootElement).render(<App />);
}

// Visit tracking — fires after first paint, never blocks rendering
if (typeof window !== 'undefined' && typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(() => {
    const data = JSON.stringify({
      path: window.location.pathname,
      referrer: document.referrer || '',
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([data], { type: 'application/json' }));
    }
  });
}
