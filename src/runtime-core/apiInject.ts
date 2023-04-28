import { isFunction } from '../shared';
import { getCurrentInstance } from './component';

export function provide(key: any, value: any) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;

    if (currentInstance.provides === parentProvides) {
      currentInstance.provides = Object.create(parentProvides);
    }

    currentInstance.provides[key] = value;
  }
}
export function inject(key: any, defaultValue?: any) {
  const currentInstance = getCurrentInstance();
  const parentProvides = currentInstance.parent.provides;
  if (currentInstance) {
    if (key in parentProvides) {
      return parentProvides[key];
    }

    if (defaultValue) {
      if (isFunction(defaultValue)) {
        return defaultValue();
      }

      return defaultValue;
    }
  }
}
