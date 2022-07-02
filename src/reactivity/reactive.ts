import { mutableHandlers, readonlyHandlers } from './baseHandler';

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive<T extends Object>(object: T): T {
  return createActiveObject<T>(object, mutableHandlers);
}

export function readonly<T extends Object>(object: T): T {
  return createActiveObject<T>(object, readonlyHandlers);
}

export function isReactive(object:any){
  return !!object[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(object:any){
  return !!object[ReactiveFlags.IS_READONLY]
}

function createActiveObject<T extends Object>(
  object: T,
  baseHandlers: ProxyHandler<T>
): T {
  return new Proxy(object, baseHandlers);
}
