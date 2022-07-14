export const extend = Object.assign;

export const isObject = (obj: any) => {
  return obj !== undefined && obj !== null && typeof obj === 'object';
};

export const isArray = (obj: any) => {
  return Array.isArray(obj);
};
export const hasChanged = (value: any, newValue: any) => {
  return !Object.is(value, newValue);
};

export const hasOwn = (target: Object, key: PropertyKey) => {
  return Object.prototype.hasOwnProperty.call(target, key);
};

export const toHandlerKey = (str: string) => {
  return `on${capitalize(str)}`;
};

export const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c.toLocaleUpperCase();
  });
};
