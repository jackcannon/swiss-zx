// Array to Natural Language list
export const arrayToNLList = (arr: any[]): string => {
  let joinArr = arr;
  if (joinArr.length >= 2) {
    joinArr = [joinArr.slice(0, -1).join(', '), '&', ...joinArr.slice(-1)];
  }
  return joinArr.join(' ');
};
