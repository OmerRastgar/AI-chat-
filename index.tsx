
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import lightFavicon from './src/assets/images/light-background-collapsed-to-thin.svg';
import darkFavicon from './src/assets/images/dark-background-collapsed-to-thin.svg';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// --- Theme-aware Favicon Logic ---

// Get or create the favicon link element
let faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
if (!faviconLink) {
  faviconLink = document.createElement('link');
  faviconLink.rel = 'icon';
  faviconLink.type = 'image/svg+xml';
  document.head.appendChild(faviconLink);
}
// Add the sizes attribute to hint that the icon is scalable
faviconLink.sizes.add('any');


const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Function to update the favicon
const updateFavicon = (isDarkMode: boolean) => {
  if (faviconLink) {
    faviconLink.href = isDarkMode ? darkFavicon : lightFavicon;
  }
};

// Set the initial favicon
updateFavicon(darkModeMediaQuery.matches);

// Listen for theme changes
darkModeMediaQuery.addEventListener('change', (e) => {
  updateFavicon(e.matches);
});


const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
