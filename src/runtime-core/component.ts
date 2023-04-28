import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { PublicInstanceHandlers } from './componentPublicInstance';
import { initSlots } from './componentSlots';

export function createComponentInstance(vnode: any, parent: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    parent,
    provides: parent ? parent.provides : {},
    emit: () => {},
  };

  component.emit = emit as any;

  return component;
}
export function setupComponent(instance: any) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const component = instance.type;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers);

  if (component.setup) {
    setCurrentInstance(instance);
    const setupResult = component.setup(shallowReadonly(instance.props), {
      emit: instance.emit.bind(null, instance),
    });
    setCurrentInstance(null);

    handleSetupResult(instance, setupResult);
    finishComponentSetup(instance);
  }
}

let currentInstance: any = null;

function setCurrentInstance(instance: any) {
  currentInstance = instance;
}

export function getCurrentInstance() {
  return currentInstance;
}

function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }
}
function finishComponentSetup(instance: any) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}
