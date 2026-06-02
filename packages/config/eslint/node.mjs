import globals from 'globals';

import basicConfig from './basic.mjs';

export default [
  ...basicConfig,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        project: null,
      },
    },
    rules: {
      // Node.js best practices
      'no-console': 'off', // Console is expected in Node
      'no-process-exit': 'warn',
    },
  },
];
