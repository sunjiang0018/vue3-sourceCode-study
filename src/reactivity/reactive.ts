import { track, trigger } from './effect';

export function reactive<T extends Object>(object: T): T {
  const proxy = new Proxy(object, {
    get(target, key) {
      const result = Reflect.get(target, key);

      //  依赖收集
      track(track, key);

      return result;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);

      //  触发依赖
      trigger(track, key);

      return result;
    },
  });
  return proxy;
}
