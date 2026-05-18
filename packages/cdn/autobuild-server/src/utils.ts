import path from 'path';
import escapeHtml from 'escape-html';
import fs from 'fs-extra';
import pacote from 'pacote';

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

const sanitizeScope = (value: string) => value.replace(/[^@a-zA-Z0-9._-]/g, '');
const sanitizeName = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, '');
const sanitizeVersion = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, '');
const sanitizeExportPath = (value: string) =>
  value
    .split('/')
    .map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, ''))
    .filter(Boolean)
    .join('/');

export const extractParams = ({
  urlScope,
  urlName,
  urlVersion,
  urlExportPath,
  TMP_DIR,
  CDN_DIR,
}: ExtractParamsProps) => {
  // Sanitize the inputs
  const scope = typeof urlScope === 'string' ? sanitizeScope(urlScope) : undefined;
  const name = typeof urlName === 'string' ? sanitizeName(urlName) : '';
  const version = typeof urlVersion === 'string' ? sanitizeVersion(urlVersion) : '';
  const cleanExportPath = typeof urlExportPath === 'string' ? sanitizeExportPath(urlExportPath) : '';
  const exportPath = cleanExportPath ? `./${cleanExportPath}` : '.';

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
    if (scope === '@grasdouble' || scope === 'grasdouble') {
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
  const pkgJsonPath = path.join(cdnPkgPath, 'package.json');

  if (!fs.existsSync(pkgJsonPath)) {
    console.error(`❌ [sendEntry] package.json not found at: ${pkgJsonPath}`);
    return {
      status: 500,
      message: `package.json not found for ${escapeHtml(fullName)} at ${escapeHtml(pkgJsonPath)}`,
    };
  }

  const pkgJson: PackageJson = await fs.readJson(pkgJsonPath);

  const exportEntry = pkgJson.exports?.[exportPath];
  const resolvedExportEntry =
    typeof exportEntry === 'object' && exportEntry !== null ? (exportEntry.import ?? exportEntry.default) : exportEntry;

  const entry = resolvedExportEntry ?? pkgJson.module ?? pkgJson.main;

  if (typeof entry !== 'string') {
    console.error(
      `❌ [sendEntry] no valid entry for "${exportPath}" in ${fullName}. exports=${JSON.stringify(pkgJson.exports)}, module=${pkgJson.module}, main=${pkgJson.main}`
    );
    return {
      status: 500,
      message: `No valid entry point for export "${escapeHtml(exportPath)}" in ${escapeHtml(fullName)}. Check the package exports field.`,
    };
  }

  const outputFile = path.resolve(cdnPkgPath, entry);

  if (!fs.existsSync(outputFile)) {
    console.error(`❌ [sendEntry] resolved file does not exist on disk: ${outputFile}`);
    return {
      status: 500,
      message: `Entry file not found on disk for ${escapeHtml(fullName)}: ${escapeHtml(entry)}`,
    };
  }

  return { status: 200, outputFile };
};
