export interface ExplodedPath {
  /**
   * The directory path of the given path
   *
   * Note: no trailing slash
   */
  dir: string;

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
export const explodePath = (filepath: string): ExplodedPath => {
  const dir = (filepath.match(/(.*[\\\/])*/) || [])[0].replace(/[\\\/]$/, ''); // everything up to last '/' or '\'
  const filename = (filepath.match(/[^\\\/]*$/) || [])[0]; // from last '/' or '\' onwards

  const ext = ((filename.match(/\.[^\.]*$/) || [])[0] || '').replace(/^\./, ''); // after last . in filename
  const name = filename.replace(ext, '').replace(/[\.]$/, ''); // until last . in filename

  return { dir, name, ext, filename };
};
