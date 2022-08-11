export const closeFinder = async (): Promise<void> => {
  await $`osascript -e 'tell application "Finder" to close every window'`;
};
