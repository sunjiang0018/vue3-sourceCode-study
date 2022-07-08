import { isArray, isObject } from '../shared';
import { createComponmentInstance, setupComponment } from './componment';

export function render(vnode: any, container: any) {
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  if (isObject(vnode.type)) {
    processComponment(vnode, container);
  } else {
    processElement(vnode, container);
  }
}
function processComponment(vnode: any, container: any) {
  mountComponment(vnode, container);
}

function mountComponment(vnode: any, container: any) {
  const instance = createComponmentInstance(vnode);

  setupComponment(instance);
  setupRenderEffect(instance, container);
}

function processElement(vnode: any, container: Element) {
  const el: Element = document.createElement(vnode.type);

  const { props, children } = vnode;

  if (props) {
    for (const key in props) {
      let val = props[key];
      if (key === 'class' && isArray(val)) {
        val = val.join(' ');
      }
      el.setAttribute(key, val);
    }
  }

  if (isArray(children)) {
    mountChildren(children, el);
  } else {
    el.textContent = children;
  }

  container.append(el);
}

function mountChildren(children: any[], el: Element) {
  for (const item of children) {
    patch(item, el);
  }
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render();
  patch(subTree, container);
}
