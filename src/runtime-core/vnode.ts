import { isArray, isObject } from '../shared';
import { ShapeFlags } from '../shared/shapeFlags';

export function createVNode(type: any, props?: any, children?: any) {
  const VNode = {
    type,
    props,
    shapeFlags: getShapeFlages(type),
    children,
  };

  if (isArray(children)) {
    VNode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === 'string') {
    VNode.shapeFlags |= ShapeFlags.TEXT_CHILDREN;
  }
  return VNode;
}

function getShapeFlages(type: any) {
  if (isObject(type)) {
    return ShapeFlags.STATEFUL_COMPONMENT;
  } else {
    return ShapeFlags.ELEMENT;
  }
}
