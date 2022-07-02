import { ReactiveEffect } from '../effect';

export interface Runner {
  (): any;
  effect: ReactiveEffect;
}

export interface EffectOptions {
  scheduler?: ()=> void;
  onStop?: () => void;
}
