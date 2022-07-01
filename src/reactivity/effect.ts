class ReactiveEffect {
  private _fn: () => void;

  constructor(fn: () => void) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    this._fn();
  }
}

let activeEffect: ReactiveEffect | undefined;

export function effect(fn: () => void) {
  const _effect = new ReactiveEffect(fn);

  _effect.run();
}

const targetMap = new Map<
  Object,
  Map<string | Symbol, Set<typeof activeEffect>>
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

  deps.add(activeEffect);
}

export function trigger<T extends Object>(target: T, key: string | Symbol) {
  const depsMap = targetMap.get(target);

  if (!depsMap) return;

  const deps = depsMap.get(key);

  if (!deps) return;

  for (const effect of deps) {
    effect?.run();
  }
  
}
