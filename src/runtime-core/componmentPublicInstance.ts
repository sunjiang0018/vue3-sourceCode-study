const publicPropertiesMap: Record<PropertyKey, Function> = {
  $el: (i: any) => i.vnode.el,
};

export const PublicInstanceHandlers = {
  get(target: any, key: PropertyKey) {
    const { _: instance } = target;
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }

    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
