import { isArray, isObject } from '../shared';
import { ShapeFlags } from '../shared/shapeFlags';

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

export function createVNode(type: any, props?: any, children?: any) {
  const vnode = {
    type,
    props,
    shapeFlags: getShapeFlags(type),
    children,
  };

  if (isArray(children)) {
    vnode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === 'string') {
    vnode.shapeFlags |= ShapeFlags.TEXT_CHILDREN;
  }

  if (vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    if (isObject(children)) {
      vnode.shapeFlags |= ShapeFlags.SLOT_CHILDREN;
    }
  }
  return vnode;
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text  );
}

function getShapeFlags(type: any) {
  if (isObject(type)) {
    return ShapeFlags.STATEFUL_COMPONENT;
  } else {
    return ShapeFlags.ELEMENT;
  }
}
