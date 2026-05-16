export type PackageJson = {
  name: string;
  version: string;
  type?: 'module' | 'commonjs';
  main?: string;
  module?: string;
  exports?: Record<string, string | { import?: string; default?: string }>;
  peerDependencies?: Record<string, string>;
};

export type ExtractedParams = {
  scope?: string;
  exportPath?: string;
  fullName: string;
  dirName: string;
  cdnPkgPath: string;
  tmpPkgPath: string;
};

export type LoadLibraryResult = {
  status: number;
  message: string;
};
