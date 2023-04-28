import { isArray } from '../shared';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';
import { Fragment, Text } from './vnode';

export function createRenderer(options: any) {
  const { createElement, patchProp, insert } = options;
  function render(vnode: any, container: any) {
    patch(vnode, container, null);
  }

  function patch(vnode: any, container: any, parentComponent: any) {
    const { type, shapeFlags } = vnode;
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent);
        } else if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent);
        }
        break;
    }
  }
  function processComponent(vnode: any, container: any, parent: any) {
    mountComponent(vnode, container, parent);
  }

  function mountComponent(initialVNode: any, container: any, parent: any) {
    const instance = createComponentInstance(initialVNode, parent);

    setupComponent(instance);
    setupRenderEffect(instance, container);
  }

  function processElement(
    vnode: any,
    container: Element,
    parentComponent: any
  ) {
    const el: Element = (vnode.el = createElement(vnode.type));

    const { props, children } = vnode;

    if (props) {
      for (const key in props) {
        let val = props[key];
        patchProp(el, key, val);
      }
    }

    const { shapeFlags } = vnode;
    if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent);
    } else if (shapeFlags && ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    }

    insert(el, container);
  }

  function mountChildren(children: any[], el: Element, parentComponent: any) {
    for (const item of children) {
      patch(item, el, parentComponent);
    }
  }

  function setupRenderEffect(instance: any, container: any) {
    const { proxy, vnode } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container, instance);

    vnode.el = subTree.el;
  }
  function processFragment(vnode: any, container: any, parentComponent: any) {
    const { children } = vnode;
    mountChildren(children, container, parentComponent);
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  return {
    createApp: createAppAPI(render),
  };
}
