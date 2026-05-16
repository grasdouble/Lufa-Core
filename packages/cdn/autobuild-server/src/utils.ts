import path from 'path';
import escapeHtml from 'escape-html';
import fs from 'fs-extra';
import pacote from 'pacote';
import sanitize from 'sanitize-filename';

import type { PackageJson } from './types.js';

// Generates a clear file name, with @ and / preserved
const makePackageDirName = (pkg: string, version: string) => `${pkg}@${version}`;

const getPackageName = (scope: string | undefined, name: string) => {
  if (scope) {
    return `${scope}/${name}`;
  }
  return name;
};

export type ExtractParamsProps = {
  urlScope?: string;
  urlName: string;
  urlVersion?: string;
  urlExportPath?: string;
  TMP_DIR: string;
  CDN_DIR: string;
};
export const extractParams = ({
  urlScope,
  urlName,
  urlVersion,
  urlExportPath,
  TMP_DIR,
  CDN_DIR,
}: ExtractParamsProps) => {
  // Sanitize the inputs
  const scope = typeof urlScope === 'string' ? sanitize(urlScope) : undefined;
  const name = typeof urlName === 'string' ? sanitize(urlName) : '';
  const version = typeof urlVersion === 'string' ? sanitize(urlVersion) : '';
  const exportPath = typeof urlExportPath === 'string' ? `./${sanitize(urlExportPath)}` : '.';

  const fullName = `${getPackageName(scope, name)}@${version}`;
  const dirName = makePackageDirName(getPackageName(scope, name), version);

  const cdnPkgPath = path.resolve(CDN_DIR, dirName);
  const tmpPkgPath = path.resolve(TMP_DIR, dirName);

  return {
    scope,
    exportPath,
    fullName,
    dirName,
    tmpPkgPath,
    cdnPkgPath,
  };
};

type LoadLibraryProps = {
  scope?: string;
  fullName: string;
  tmpPkgPath: string;
  cdnPkgPath: string;
  TMP_DIR: string;
  CDN_DIR: string;
  GITHUB_TOKEN: string;
};
export const loadLibrary = async ({
  scope,
  fullName,
  tmpPkgPath,
  cdnPkgPath,
  TMP_DIR,
  CDN_DIR,
  GITHUB_TOKEN,
}: LoadLibraryProps) => {
  // Check if the path is outside the CDN_DIR
  if (!tmpPkgPath.startsWith(TMP_DIR) || !cdnPkgPath.startsWith(CDN_DIR)) {
    console.error('❌ Path is outside the CDN_DIR or TMP_DIR');
    return {
      status: 403,
      message: 'Forbidden',
    };
  }

  try {
    if (scope === '@grasdouble') {
      console.log(`Loading package ${fullName} from GitHub...`);
      // For @grasdouble packages, we use the GitHub registry
      await pacote.extract(fullName, cdnPkgPath, {
        registry: 'https://npm.pkg.github.com',
        scope: '@grasdouble',
        headers: {
          authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      });
    } else {
      console.log(`Loading package ${fullName} from npm...`);
      await pacote.extract(fullName, tmpPkgPath);
    }
    console.log(`Package ${fullName} loaded successfully.`);
    return {
      status: 200,
      message: 'Package loaded successfully from npm or github',
    };
  } catch (err) {
    console.error(`❌ Error with ${fullName}:`, err);
    if (tmpPkgPath) {
      await fs.remove(tmpPkgPath);
    }
    if (cdnPkgPath) {
      await fs.remove(cdnPkgPath);
    }
    return {
      status: 500,
      message: `Error with the package ${escapeHtml(fullName)}`,
    };
  }
};

export type SendEntryProps = {
  exportPath: string;
  cdnPkgPath: string;
  fullName: string;
};
export const sendEntry = async ({ exportPath, cdnPkgPath, fullName }: SendEntryProps) => {
  const pkgJson: PackageJson = await fs.readJson(path.join(cdnPkgPath, 'package.json'));

  const entry =
    (typeof pkgJson.exports?.[exportPath] === 'object' && pkgJson.exports?.[exportPath]?.import) ??
    (typeof pkgJson.exports?.[exportPath] === 'object' && pkgJson.exports?.[exportPath]?.default) ??
    pkgJson.exports?.[exportPath] ??
    pkgJson.module ??
    pkgJson.main;
  if (typeof entry !== 'string') {
    return {
      status: 500,
      message: `The entry point for ${escapeHtml(fullName)} is not valid.`,
    };
  }
  const outputFile = path.resolve(cdnPkgPath, entry);
  console.log(`Entry point path found: ${outputFile}`);

  return { status: 200, outputFile };
};
