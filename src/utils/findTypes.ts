/**<!-- DOCS-ALIAS: $$.FindType -->*/
export type FindType = 'd' | 'f' | 'b' | 'c' | 'l' | 'p' | 's';

/**<!-- DOCS-ALIAS: $$.FindOptions -->*/
export interface FindOptions {
  /**
   * Type of item to find
   *
   * |   | Description       |
   * |---|-------------------|
   * | d | directory         |
   * | f | regular file      |
   * | b | block special     |
   * | c | character special |
   * | l | symbolic link     |
   * | p | FIFO              |
   * | s | socket            |
   */
  type?: FindType;
  /**
   * TODO docs
   * Minimum depth to search
   */
  mindepth?: number;
  /**
   * Maximum depth to search
   */
  maxdepth?: number;
  /**
   * Name of file/directory to find
   */
  name?: string;

  ext?: string;

  /**
   * Regular expression to match
   *
   * IMPORTANT: use String.raw to make sure the backslashes are escaped
   *
   * ```typescript
   * const regex = String.raw`^.*\.js$` // '^.*\.js$'
   * ```
   */
  regex?: string;
  /**
   * If true, removes the path from the result (so you just get the file/directory name)
   */
  removePath?: boolean;
  /**
   * TODO docs
   */
  absolutePath?: boolean;
  /**
   * If true, ensures the provided path has a trailing slash.
   */
  contentsOnly?: boolean;
  /**
   * If true, removes trailing slashes from the results.
   */
  removeTrailingSlashes?: boolean;
  /**
   * If true, includes files that start with a dot.
   */
  showHidden?: boolean;
}
