export const extend = Object.assign;

export const isObject = (obj: any) => {
  return obj !== undefined && obj !== null && typeof obj === 'object';
};
