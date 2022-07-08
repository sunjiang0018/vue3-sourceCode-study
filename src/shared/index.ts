export const extend = Object.assign;

export const isObject = (obj: any) => {
  return obj !== undefined && obj !== null && typeof obj === 'object';
};

export const isArray= (obj:any) =>{
  return Array.isArray(obj)
}
export const hasChanged = (value: any, newValue: any) => {
  return !Object.is(value, newValue);
};