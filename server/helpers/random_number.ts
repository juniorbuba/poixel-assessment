export const randomNumber = (size = 6): string => {
  let str = '';
  for (let i = 0; i < size; i += 1) {
    str += String(Math.floor(Math.random() * 10));
  }
  return str;
};
