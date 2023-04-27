import { ShapeFlags } from './../shared/shapeFlags';
export function initSlots(instance: any, children: any) {
  const { vnode } = instance;
  if (vnode.shapeFlags & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(instance.slots, children);
  }
}
function normalizeObjectSlots(slots: any, children: any) {
  for (let key in children) {
    const value = children[key];
    slots[key] = (props: any) => normalizeSlotValue(value(props));
  }
}

function normalizeSlotValue(value: any) {
  return Array.isArray(value) ? value : [value];
}
