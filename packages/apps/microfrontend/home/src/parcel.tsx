import React from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

import App from './App';

let root: Root | null = null;

export const bootstrap = () => {
  return Promise.resolve();
};

export const mount = () => {
  return new Promise((resolve, reject) => {
    const container = document.getElementById('lufa-container');
    if (container) {
      root ??= createRoot(container);
      root.render(<App />);
      resolve(void 0);
    } else {
      reject(new Error('Container element not found'));
    }
  });
};

export const unmount = () => {
  return new Promise((resolve) => {
    if (root) {
      root.unmount();
      root = null;
    } else {
      console.error('React root not initialized for unmounting');
    }
    resolve(void 0);
  });
};
