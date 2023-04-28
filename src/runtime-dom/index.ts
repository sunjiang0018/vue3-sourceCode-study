import { createRenderer } from '../runtime-core';
import { isArray } from '../shared';

function createElement(type: any) {
  return document.createElement(type);
}
function patchProp(el: any, key: any, val: any) {
  if (key === 'class' && isArray(val)) {
    val = val.join(' ');
  }
  const isOn = (attr: string) => /on[A-Z]/.test(attr);
  if (isOn(key)) {
    const eventName = key.slice(2).toLocaleLowerCase();
    el.addEventListener(eventName, val);
  } else {
    el.setAttribute(key, val);
  }
}
function insert(el: any, parent: any) {
  parent.append(el);
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
});

export function createApp(...args: any[]) {
  return renderer.createApp(...args);
}

export * from '../runtime-core';
