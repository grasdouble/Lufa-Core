import fs from 'fs';
import path from 'path';

export default function importMapPlugin({
  extImportMap = 'importMapExternal.json',
  prodImportMap = 'importMap.json',
  devImportMap = 'importMap.dev.json',
  previewImportMap = 'importMap.preview.json',
} = {}) {
  let runtime = {
    command: 'build',
    mode: 'production',
    isPreview: false,
  };

  return {
    name: 'vite-plugin-importmap',
    configResolved(config) {
      runtime = {
        command: config.command,
        mode: config.mode,
        isPreview: config.mode === 'preview',
      };
    },
    transformIndexHtml(html) {
      const isDev = runtime.command === 'serve';
      const isPreviewBuild = runtime.command === 'build' && runtime.isPreview;
      const isProdBuild = runtime.command === 'build' && !runtime.isPreview;
      const extImportMapPath = path.resolve(process.cwd(), extImportMap);
      const prodImportMapPath = path.resolve(process.cwd(), prodImportMap);
      const devImportMapPath = path.resolve(process.cwd(), devImportMap);
      const previewImportMapPath = path.resolve(process.cwd(), previewImportMap);

      let extImportMapContent = {};
      let prodImportMapContent = {};
      let devImportMapContent = {};
      let previewImportMapContent = {};

      if (fs.existsSync(extImportMapPath)) {
        extImportMapContent = JSON.parse(fs.readFileSync(extImportMapPath, 'utf-8'));
      } else {
        console.warn(`[vite-plugin-importmap-injector] ⚠️ import-map for externals not found: ${extImportMapPath}`);
      }

      if (fs.existsSync(prodImportMapPath)) {
        prodImportMapContent = JSON.parse(fs.readFileSync(prodImportMapPath, 'utf-8'));
      } else {
        console.warn(`[vite-plugin-importmap-injector] ⚠️ import-map for production not found: ${prodImportMapPath}`);
      }

      if (isDev && fs.existsSync(devImportMapPath)) {
        devImportMapContent = JSON.parse(fs.readFileSync(devImportMapPath, 'utf-8'));
      } else if (isDev) {
        console.warn(`[vite-plugin-importmap-injector] ⚠️ import-map for development not found: ${devImportMapPath}`);
      }

      if (isPreviewBuild && fs.existsSync(previewImportMapPath)) {
        previewImportMapContent = JSON.parse(fs.readFileSync(previewImportMapPath, 'utf-8'));
      } else if (isPreviewBuild) {
        console.warn(`[vite-plugin-importmap-injector] ⚠️ import-map for preview not found: ${previewImportMapPath}`);
      }

      const mergedImportMap = {
        imports: {
          ...(isProdBuild ? prodImportMapContent.imports || {} : {}),
          ...(isDev ? devImportMapContent.imports || {} : {}),
          // Preview = prod entries as a base, overridden by preview-specific entries
          // (e.g. point the home MFE to localhost while keeping CDN URLs for the DS)
          ...(isPreviewBuild ? prodImportMapContent.imports || {} : {}),
          ...(isPreviewBuild ? previewImportMapContent.imports || {} : {}),
        },
      };

      // overridable-importmap is a custom attribute used by single-spa and import-map-overrides
      // to allow the import map to be overridden at runtime
      // see https://github.com/single-spa/import-map-overrides/blob/main/docs/configuration.md#client-side-single-map
      // The choice has been made to use standard importmap for the external dependencies like that it will not be possible to override them
      const importMapScripts = [`<script type="importmap">${JSON.stringify(extImportMapContent, null, 2)}</script>`];

      if (isDev || isPreviewBuild) {
        importMapScripts.push(
          `<script type="importmap" overridable="true">${JSON.stringify(mergedImportMap, null, 2)}</script>`
        );
      }

      return html.replace('</head>', `${importMapScripts.join('\n')}\n</head>`);
    },
  };
}
