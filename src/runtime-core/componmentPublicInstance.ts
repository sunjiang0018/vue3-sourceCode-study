import { hasOwn } from './../shared/index';
const publicPropertiesMap: Record<PropertyKey, Function> = {
  $el: (i: any) => i.vnode.el,
};

export const PublicInstanceHandlers = {
  get(target: any, key: PropertyKey) {
    const { _: instance } = target;
    const { setupState, props } = instance;
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }

    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
