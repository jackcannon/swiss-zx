export interface ExplodedPath {
  /**
   * The full original path as it was passed in.
   */
  path: string;

  /**
   * The directory path of the given path
   *
   * Note: no trailing slash
   */
  dir: string;

  /**
   * the ancestral folders of the given dir as an array
   */
  folders: string[];

  /**
   * the name of the file, not including the extension
   */
  name: string;

  /**
   * the extension of the file, not including the dot
   */
  ext: string;

  /**
   * the full name of the file, including the extension (and dot)
   */
  filename: string;
}

/**
 * explodePath
 *
 * TODO update docs for folders and path
 *
 * 'Explodes' a path into its components
 *
 * - dir: the directory path of the given path
 * - name: the name of the file, not including the extension
 * - ext: the extension of the file, not including the dot
 * - filename: the full name of the file, including the extension (and dot)
 *
 * ```typescript
 * const { dir, name, ext, filename } = explodePath('/path/to/file.txt');
 *
 * console.log(dir); // '/path/to'
 * console.log(name); // 'file'
 * console.log(ext); // 'txt'
 * console.log(filename); // 'file.txt'
 * ```
 */
export const explodePath = (path: string): ExplodedPath => {
  const dir = (path.match(/(.*[\\\/])*/) || [])[0].replace(/[\\\/]$/, ''); // everything up to last '/' or '\'
  const filename = (path.match(/[^\\\/]*$/) || [])[0]; // from last '/' or '\' onwards

  const ext = ((filename.match(/\.[^\.]*$/) || [])[0] || '').replace(/^\./, ''); // after last . in filename
  const name = filename.replace(ext, '').replace(/[\.]$/, ''); // until last . in filename

  const folders = dir.split(/[\\\/]/).filter((x) => x);

  return { path, dir, folders, name, ext, filename };
};
