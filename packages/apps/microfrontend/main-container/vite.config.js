import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

import importMapInjectorPlugin from '@grasdouble/lufa_plugin_vite_vite-plugin-import-map-injector';
import reactPreamblePlugin from '@grasdouble/lufa_plugin_vite_vite-plugin-react-preamble';

export default defineConfig({
  plugins: [
    importMapInjectorPlugin({
      extImportMap: 'src/importMapExternal.json',
      devImportMap: 'src/importMap.dev.json',
      prodImportMap: 'src/importMap.json',
    }),
    externalizeDeps({
      deps: false,
      devDeps: false,
      optionalDeps: false,
      peerDeps: true,
      except: [],
      nodeBuiltins: true,
    }),
    reactPreamblePlugin(),
  ],
  build: {
    target: 'esnext',
    modulePreload: false, // Single-SPA manages the loading of modules
    minify: false,
    rolldownOptions: {
      output: {
        format: 'esm',
        entryFileNames: '[name].js',
      },
    },
  },
  server: {
    port: 5173,
    cors: true,
    hmr: true,
  },
  preview: {
    port: 5173,
  },
});
