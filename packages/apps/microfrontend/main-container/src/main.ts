import type { LifeCycles } from 'single-spa';
import { registerApplication, start } from 'single-spa';

import 'import-map-overrides';

const loadApp =
  (url: string): (() => Promise<LifeCycles>) =>
  () =>
    import(/* @vite-ignore */ url);

// PARCELS
registerApplication({
  name: '@grasdouble/lufa_microfrontend_home',
  app: loadApp('@grasdouble/lufa_microfrontend_home'),
  activeWhen: (location: Location) => location.pathname === '/',
});

registerApplication({
  name: '@grasdouble/lufa_design-system-storybook',
  app: () => {
    // Create a false module to encapsulate your storybook application
    return Promise.resolve({
      bootstrap: (): Promise<void> => Promise.resolve(),
      mount: (): Promise<void> => {
        // Create an iframe to encapsulate the storybook application
        const iframe = document.createElement('iframe');
        iframe.id = 'storybook-iframe'; // Add an ID for easier unmounting
        iframe.src = 'https://lufa-storybook.sebastien-lemouillour.fr';
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        const appElement = document.getElementById('app');
        if (appElement) {
          appElement.appendChild(iframe);
        }
        return Promise.resolve();
      },
      unmount: (): Promise<void> => {
        // Unmount the iframe and remove it from the DOM
        const iframe = document.getElementById('storybook-iframe');
        if (iframe) {
          iframe.remove();
        }
        return Promise.resolve();
      },
    });
  },
  activeWhen: ['/storybook'], // Active when the URL is /storybook
});

start();
