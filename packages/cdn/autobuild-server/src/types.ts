export type ExportTarget = string | null | ExportTarget[] | { [condition: string]: ExportTarget };

export type PackageJson = {
  name?: string;
  version?: string;
  type?: 'module' | 'commonjs';
  main?: string;
  module?: string;
  exports?: ExportTarget;
};

export type LoadLibraryResult = { status: number; message: string };
