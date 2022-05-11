import { IS_CONTROLLER, METADATA_HOST, METADATA_PATH, METADATA_SCOPE} from './constant'
import { ScopeEnum } from '@artus/injection'

export interface WebControllerOptions {
  scope?: ScopeEnum;
  path?: string | string[];
  host?: string | RegExp | Array<string | RegExp>;
}

export function Controller(): ClassDecorator;
/**
 * controller decorator which accepts string/string[] as path prefix 
 * @param {string, string[]} prefix prefix of path
 */
export function Controller(prefix: string | string[]): ClassDecorator;
/**
 * controller decorator which accepts an object. 
 * @param {object} options configuration about 'scope', 'host', 'prefix'
 */
export function Controller(options: WebControllerOptions): ClassDecorator;

/**
 * controller decorator which accepts string/string[] or object. 
 * @param {string, string[], object} prefixOrOptions maybe string or object
 * @returns 
 */
export function Controller(prefixOrOptions?: string | string[] | WebControllerOptions): ClassDecorator {
  const defaultPath = '/';

  const [path, host, scope] = typeof prefixOrOptions === 'undefined'
    ? [defaultPath, undefined, undefined]
    : typeof prefixOrOptions === 'string' || Array.isArray(prefixOrOptions)
      ? [prefixOrOptions, undefined, undefined]
      : [
        prefixOrOptions.path || defaultPath,
        prefixOrOptions.host,
        { scope: prefixOrOptions.scope }
      ];

  return (target: object) => {
    Reflect.defineMetadata(IS_CONTROLLER, true, target);
    Reflect.defineMetadata(METADATA_PATH, path, target);
    Reflect.defineMetadata(METADATA_HOST, host, target);
    Reflect.defineMetadata(METADATA_SCOPE, scope, target);
  };
}