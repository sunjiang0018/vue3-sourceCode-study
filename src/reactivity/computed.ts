import { effect, ReactiveEffect } from './effect';
import { ref } from './ref';

class ComputedRefImpl {
  private _getter: () => any;
  private _value: any;
  private _dirty = true;
  private _effect: ReactiveEffect;

  constructor(getter: () => any) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }

    return this._value;
  }
}

export function computed(fn: () => any): ComputedRefImpl {
  return new ComputedRefImpl(fn);
}
