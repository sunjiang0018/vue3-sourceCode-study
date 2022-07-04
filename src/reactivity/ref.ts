import { hasChanged, isObject } from '../shared';
import { isTracking, trackEffect, triggerEffect } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value: any;

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

function convert(value: any) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value: any) {
  return new RefImpl(value);
}
