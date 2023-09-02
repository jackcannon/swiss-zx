//<!-- DOCS: 200 -->

/**<!-- DOCS: os ##! -->
 * os
 */
/**<!-- DOCS: os.closeFinder ### @ -->
 * closeFinder
 *
 * - `closeFinder`
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
