import { isArray } from '../shared';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { Fragment,Text } from './vnode';

export function render(vnode: any, container: any) {
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  const { type, shapeFlags } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      } else if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      }
      break;
  }
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode);

  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function processElement(vnode: any, container: Element) {
  const el: Element = (vnode.el = document.createElement(vnode.type));

  const { props, children } = vnode;

  if (props) {
    for (const key in props) {
      let val = props[key];
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
  }

  const { shapeFlags } = vnode;
  if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el);
  } else if (shapeFlags && ShapeFlags.TEXT_CHILDREN) {
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
  const { proxy, vnode } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);

  vnode.el = subTree.el;
}
function processFragment(vnode: any, container: any) {
  const { children } = vnode;
  mountChildren(children, container);
}

function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}
