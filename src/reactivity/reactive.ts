import { isObject } from './../shared/index';
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandler';

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function reactive<T extends Object>(object: T): T {
  return createActiveObject<T>(object, mutableHandlers);
}

export function readonly<T extends Object>(object: T): T {
  return createActiveObject<T>(object, readonlyHandlers);
}

export function shallowReadonly<T extends Object>(object: T): T {
  return createActiveObject<T>(object, shallowReadonlyHandlers);
}

export function isReactive(object: any) {
  return !!object[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(object: any) {
  return !!object[ReactiveFlags.IS_READONLY];
}

export function isProxy(object: any) {
  return isReactive(object) || isReadonly(object);
}

function createActiveObject<T extends Object>(
  object: T,
  baseHandlers: ProxyHandler<T>
): T {
  if (!isObject(object)) {
    console.warn(`target:${object}, 不是一个对象`);
  }
  return new Proxy(object, baseHandlers);
}
