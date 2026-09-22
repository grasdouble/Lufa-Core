import path from 'path';
import escapeHtml from 'escape-html';
import fs from 'fs-extra';
import pacote from 'pacote';

import type { ExportTarget, LoadLibraryResult, PackageJson } from './types.js';

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

// Normalize bare "grasdouble" scope to "@grasdouble" so the GitHub registry spec is always valid
const normalizeScope = (scope: string): string => {
  if (scope === 'grasdouble') return '@grasdouble';
  return scope;
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
  const rawScope = typeof urlScope === 'string' ? sanitizeScope(urlScope) : undefined;
  const scope = rawScope !== undefined ? normalizeScope(rawScope) : undefined;
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

export type LoadLibraryProps = {
  scope?: string;
  fullName: string;
  cdnPkgPath: string;
  CDN_DIR: string;
  GITHUB_TOKEN: string;
};

const isWithin = (root: string, file: string) => {
  const relative = path.relative(root, file);
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
};

const complete = (directory: string) => fs.pathExists(path.join(directory, '.lufa-complete'));
type Extract = (name: string, destination: string, options?: pacote.Options) => Promise<unknown>;

export const createLibraryLoader = (
  extract: Extract = (name, destination, options) => pacote.extract(name, destination, options)
) => {
  const pending = new Map<string, Promise<LoadLibraryResult>>();
  const download = async ({
    scope,
    fullName,
    cdnPkgPath,
    CDN_DIR,
    GITHUB_TOKEN,
  }: LoadLibraryProps): Promise<LoadLibraryResult> => {
    const root = path.resolve(CDN_DIR);
    const destination = path.resolve(cdnPkgPath);
    if (!isWithin(root, destination)) return { status: 403, message: 'Forbidden' };
    let staging: string | undefined;
    try {
      await fs.ensureDir(root);
      await fs.ensureDir(path.dirname(destination));
      const realRoot = await fs.realpath(root);
      const realParent = await fs.realpath(path.dirname(destination));
      if (realParent !== realRoot && !isWithin(realRoot, realParent)) return { status: 403, message: 'Forbidden' };
      if (await fs.pathExists(destination)) {
        const stat = await fs.lstat(destination);
        if (stat.isSymbolicLink()) return { status: 403, message: 'Forbidden' };
        if (await complete(destination)) return { status: 200, message: 'Package cached' };
        // Old/incomplete caches must not be treated as successful downloads.
        return {
          status: 503,
          message: 'Incomplete legacy cache: administrator must remove this package cache and retry',
        };
      }
      staging = await fs.mkdtemp(path.join(path.dirname(destination), '.lufa-download-'));
      await extract(
        fullName,
        staging,
        scope === '@grasdouble'
          ? {
              registry: 'https://npm.pkg.github.com',
              scope: '@grasdouble',
              headers: { authorization: `Bearer ${GITHUB_TOKEN}` },
            }
          : undefined
      );
      const metadata: PackageJson = await fs.readJson(path.join(staging, 'package.json'));
      if (scope !== '@grasdouble' && metadata.type !== 'module')
        return { status: 415, message: 'Only ESM packages are supported' };
      await fs.writeFile(path.join(staging, '.lufa-complete'), '1');
      try {
        await fs.rename(staging, destination);
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if ((code !== 'EEXIST' && code !== 'ENOTEMPTY') || !(await complete(destination))) throw error;
      }
      return { status: 200, message: 'Package ready' };
    } catch {
      return { status: 502, message: `Unable to load package ${escapeHtml(fullName)}` };
    } finally {
      if (staging) await fs.remove(staging);
    }
  };
  return (options: LoadLibraryProps): Promise<LoadLibraryResult> => {
    const key = path.resolve(options.cdnPkgPath);
    const existing = pending.get(key);
    if (existing) return existing;
    const promise = download(options).finally(() => pending.delete(key));
    pending.set(key, promise);
    return promise;
  };
};

export const loadLibrary = createLibraryLoader();

// Per the package "exports" spec, a target/subpath must start with "./" and no segment
// after it may be "." or ".." — otherwise it could reach outside the package or around
// an explicitly blocked sibling export (e.g. a wildcard capture like "x/../private").
const isValidSubpathValue = (value: string): boolean =>
  value.startsWith('./') && !value.split('/').some((segment, index) => index > 0 && ['.', '..', ''].includes(segment));

const resolveTarget = (target: ExportTarget | undefined): string | null | undefined => {
  if (typeof target === 'string') return isValidSubpathValue(target) ? target : undefined;
  if (target === null) return null;
  if (target === undefined) return undefined;
  if (Array.isArray(target)) {
    for (const item of target) {
      const resolved = resolveTarget(item);
      if (typeof resolved === 'string') return resolved;
    }
    return undefined;
  }
  for (const [condition, value] of Object.entries(target)) {
    if (['browser', 'import', 'default'].includes(condition)) {
      const resolved = resolveTarget(value);
      if (resolved !== undefined) return resolved;
    }
  }
  return undefined;
};

const exportTarget = (exports: ExportTarget, requested: string): ExportTarget | undefined => {
  if (requested !== '.' && !isValidSubpathValue(requested)) return undefined;
  if (exports === null || typeof exports === 'string' || Array.isArray(exports))
    return requested === '.' ? exports : undefined;
  if (!Object.keys(exports).some((key) => key.startsWith('.'))) return requested === '.' ? exports : undefined;
  if (Object.hasOwn(exports, requested)) return exports[requested];
  // Exact subpaths take precedence over the most specific pattern.
  const patterns = Object.keys(exports)
    .filter((key) => key.includes('*'))
    .sort((a, b) => b.indexOf('*') - a.indexOf('*') || b.length - a.length);
  for (const pattern of patterns) {
    const [prefix, suffix] = pattern.split('*');
    if (
      requested.startsWith(prefix) &&
      requested.endsWith(suffix) &&
      requested.length >= prefix.length + suffix.length
    ) {
      const target = resolveTarget(exports[pattern]);
      return target?.replaceAll('*', requested.slice(prefix.length, suffix ? -suffix.length : undefined));
    }
  }
  return undefined;
};

export type SendEntryProps = { exportPath: string; cdnPkgPath: string; fullName: string };
export const sendEntry = async ({ exportPath, cdnPkgPath }: SendEntryProps) => {
  try {
    const pkgJson: PackageJson = await fs.readJson(path.join(cdnPkgPath, 'package.json'));
    const entry =
      pkgJson.exports !== undefined
        ? resolveTarget(exportTarget(pkgJson.exports, exportPath))
        : exportPath === '.'
          ? (pkgJson.module ?? pkgJson.main)
          : undefined;
    if (typeof entry !== 'string') return { status: 404, message: 'Export not found' };
    const root = path.resolve(cdnPkgPath);
    const outputFile = path.resolve(root, entry);
    if (!isWithin(root, outputFile)) return { status: 403, message: 'Forbidden entry point' };
    const realRoot = await fs.realpath(root);
    const realFile = await fs.realpath(outputFile);
    if (!isWithin(realRoot, realFile)) return { status: 403, message: 'Forbidden entry point' };
    if (!(await fs.stat(realFile)).isFile()) return { status: 404, message: 'Entry file not found' };
    return { status: 200, outputFile: realFile };
  } catch (error) {
    return {
      status: (error as NodeJS.ErrnoException).code === 'ENOENT' ? 404 : 500,
      message: 'Unable to read package entry',
    };
  }
};
