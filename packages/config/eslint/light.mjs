import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    ignores: ['dist', 'build', 'node_modules'],
  },
  eslintConfigPrettier,
];
