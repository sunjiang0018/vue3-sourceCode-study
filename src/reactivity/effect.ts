import { extend } from '../shared';
import { EffectOptions, Runner } from './types';

export class ReactiveEffect {
  private _fn: Function;
  private isActive = true;

  public deps: Set<ReactiveEffect>[] = [];

  public onStop?: ()=>void;

  constructor(fn: Function) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    const result =  this._fn();
    activeEffect = undefined;
    return result;
  }

  stop() {
    if (this.isActive) {
      cleanupEffect(this);
      this.onStop?.()
      this.isActive = false;
    }
  }
}

function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
}

let activeEffect: ReactiveEffect | undefined;

export function effect(fn: Function, options?: EffectOptions) {
  const _effect = new ReactiveEffect(fn);

  extend(_effect, options);

  _effect.run();

  const runner = _effect.run.bind(_effect);
  (runner as Runner).effect = _effect;

  return runner as Runner;
}

const targetMap = new Map<
  Object,
  Map<string | Symbol, Set<ReactiveEffect>>
>();
export function track<T extends Object>(target: T, key: string | Symbol) {
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);

  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  if (!activeEffect) return;

  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

export function trigger<T extends Object>(target: T, key: string | Symbol) {
  const depsMap = targetMap.get(target);

  if (!depsMap) return;

  const deps = depsMap.get(key);

  if (!deps) return;

  for (const effect of deps) {
    if (effect?.scheduler) {
      effect.scheduler();
    } else {
      effect?.run();
    }
  }
}

export function stop(runner: Runner) {
  runner.effect.stop();
}
