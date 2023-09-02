//<!-- DOCS: 200 -->

/**<!-- DOCS: os ##! -->
 * os
 */
export namespace os {
  // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

  /**<!-- DOCS: os.closeFinder ### @ -->
   * closeFinder
   *
   * - `closeFinder`
   * - `os.closeFinder`
   *
   * Close all Mac OS X Finder windows.
   *
   * ```typescript
   * await closeFinder();
   * ```
   */
  export const closeFinder = async (): Promise<void> => {
    await $`osascript -e 'tell application "Finder" to close every window'`;
  };
} // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE

/**<!-- DOCS-ALIAS: os.closeFinder -->*/
export const closeFinder = os.closeFinder;
