import { resolve } from 'node:path';
import reactPlugin from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

export default defineConfig(({ command, mode, isPreview }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  const defaultDefine = {
    __APP_ENV__: JSON.stringify(env.APP_ENV),
  };

  const defaultPlugin = [reactPlugin()];

  // Path aliases for the new component organization structure
  const aliasConfig = {
    '@foundation': resolve(__dirname, './src/foundation'),
    '@content': resolve(__dirname, './src/content'),
    '@interaction': resolve(__dirname, './src/interaction'),
    '@composition': resolve(__dirname, './src/composition'),
    '@utility': resolve(__dirname, './src/utility'),
    '@hooks': resolve(__dirname, './src/hooks'),
    '@utils': resolve(__dirname, './src/utils'),
  };

  const getServeConfig = () => {
    return {
      // dev specific config
      resolve: {
        alias: aliasConfig,
      },
      plugins: [...defaultPlugin],
      define: {
        ...defaultDefine,
      },
    };
  };

  const getPreviewConfig = () => {
    return {
      // preview specific config
      resolve: {
        alias: aliasConfig,
      },
      plugins: [...defaultPlugin],
      define: {
        ...defaultDefine,
      },
    };
  };

  const getBuildConfig = () => {
    return {
      // build specific config
      resolve: {
        alias: aliasConfig,
      },
      plugins: [
        ...defaultPlugin,
        dts({
          entryRoot: 'src',
          tsconfigPath: './tsconfig.build.json',
          insertTypesEntry: true,
          outDirs: 'dist',
          exclude: ['**/*.test.*'],
        }),
        externalizeDeps({
          deps: true, // Externalize all dependencies EXCEPT those in 'except'
          devDeps: false,
          except: ['lucide-react'], // Bundle lucide-react into the library
          nodeBuiltins: false,
          optionalDeps: false,
          peerDeps: true,
        }),
      ],
      define: {
        ...defaultDefine,
      },
      build: {
        target: 'esnext',
        minify: false,
        sourcemap: true,
        declaration: true,
        cssMinify: false,
        outDir: 'dist',
        // assetsInlineLimit: isProduction ? 4096 : 0,
        lib: {
          formats: ['es'],
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'LufaDS',
          cssFileName: 'style',
          fileName: (format: string) => {
            let output = 'lufa-ui';
            if (format === 'es') {
              output += '.mjs';
            } else if (format === 'umd') {
              output += '.umd.cjs';
            } else {
              throw new Error('format not managed');
            }
            return output;
          },
        },
      },
      // rolldownOptions: external is intentionally not set here.
      // externalizeDeps plugin (with except: ['lucide-react']) handles externalization
      // via rollupOptions.external (array-based specifier matching), which correctly
      // externalizes CJS packages like react-dom without inlining their source.
    };
  };

  if (command === 'serve') {
    return getServeConfig();
  } else if (isPreview) {
    return getPreviewConfig();
  } else if (command === 'build') {
    return getBuildConfig();
  } else {
    // Oops something wrong should happen
    return {};
  }
});
