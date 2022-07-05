import { hasChanged, isObject } from '../shared';
import { isTracking, trackEffect, triggerEffect } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value: any;
  public __v_isRef = true;

  public dep = new Set();
  private _rawValue: any;

  constructor(value: any) {
    this._rawValue = value;
    this._value = convert(value);
  }

  get value() {
    if (isTracking()) {
      trackEffect(this.dep);
    }
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffect(this.dep);
    }
  }
}

export function isRef(value: any) {
  return !!value.__v_isRef;
}

export function unRef(raw: any) {
  return isRef(raw) ? raw.value : raw;
}

export function ref(value: any) {
  return new RefImpl(value);
}

export function proxyRefs(objectWithRefs: any) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      const value = Reflect.get(target, key);
      return unRef(value);
    },
    set(target, key, value){

      const oldValue = Reflect.get(target, key)

      if(isRef(oldValue) && !isRef(value)){
        oldValue.value = value
        return true
      }
      return Reflect.set(target, key, value)

    }
  });
}

function convert(value: any) {
  return isObject(value) ? reactive(value) : value;
}
