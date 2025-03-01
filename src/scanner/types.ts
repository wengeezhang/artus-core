import { BaseLoader, ManifestItem } from "../loader";

export interface ScannerOptions {
  appName: string;
  extensions: string[];
  needWriteFile: boolean;
  useRelativePath: boolean;
  excluded: string[];
  configDir: string;
  envs?: string[];
  loaderListGenerator: (defaultLoaderList: string[]) => (string | typeof BaseLoader)[];
}

export interface WalkOptions {
  source: string;
  baseDir: string;
  configDir: string;
  extensions: string[];
  excluded: string[];
  itemMap: Map<string, ManifestItem[]>;
  unitName?: string;
}

export interface LoaderOptions {
  root: string,
  baseDir: string,
}
